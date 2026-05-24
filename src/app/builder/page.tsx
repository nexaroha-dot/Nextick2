"use client";

import React, { useState, useCallback, useRef, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Layers, FileText, CheckSquare, Type, Hash, Image as ImageIcon, Video, List, LayoutDashboard, Inbox, Users, Megaphone, Puzzle, FolderKanban, Zap, Save, Play, GripVertical, Calendar, CalendarClock, Clock, ChevronUp, ChevronDown, Plus, Share2, Settings, HelpCircle, Globe, Lock, ArrowLeft, X, Link } from 'lucide-react';
import { ReactFlow, Background, Controls, addEdge, applyNodeChanges, applyEdgeChanges, useReactFlow, ReactFlowProvider } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import QuestionNode from '@/components/QuestionNode';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const nodeTypes = { question: QuestionNode };

let id = 100;
const getId = () => `node_${id++}`;

const initialNodes = [
  { 
    id: 'q1', position: { x: 50, y: 150 }, type: 'question',
    data: { 
      label: 'Aaj kitne demo hue?', type: 'Number', required: true,
      reportFormats: [
        { id: 'f1', condition: '<=', value: 0, bgColor: '#fee2e2', textColor: '#ef4444', isBold: true, points: -5 },
        { id: 'f2', condition: '>', value: 0, bgColor: '#dcfce7', textColor: '#22c55e', isBold: false, points: 5 },
        { id: 'f3', condition: '>', value: 5, bgColor: '#d1fae5', textColor: '#10b981', isBold: true, points: 20 }
      ]
    } 
  },
  { 
    id: 'q2', position: { x: 450, y: 150 }, type: 'question',
    data: { 
      label: 'Aaj kya koi machine kharab hui thi?', type: 'Dropdown', required: true,
      options: [{ id: 'opt_yes', label: 'Yes' }, { id: 'opt_no', label: 'No' }]
    } 
  },
  { 
    id: 'q3', position: { x: 850, y: 50 }, type: 'question',
    data: { label: 'Attach Image (Proof)', type: 'Image Attach', required: true, maxSize: 5 } 
  },
  { 
    id: 'q4', position: { x: 850, y: 350 }, type: 'question',
    data: { label: 'Please provide description of machine issue', type: 'Long Text', required: false } 
  }
];

// No conditional edges — all questions always visible
const initialEdges: any[] = [];

const FIELD_TYPES = [
  { id: 'short_text',   label: 'Short Text',     icon: Type },
  { id: 'long_text',    label: 'Long Text',       icon: FileText },
  { id: 'number',       label: 'Number',          icon: Hash },
  { id: 'dropdown',     label: 'Dropdown',        icon: List },
  { id: 'multiple',     label: 'Multiple Option', icon: CheckSquare },
  { id: 'image',        label: 'Image Attach',    icon: ImageIcon },
  { id: 'video',        label: 'Video Attach',    icon: Video },
  { id: 'date',         label: 'Date',            icon: Calendar },
  { id: 'datetime',     label: 'Date & Time',     icon: CalendarClock },
  { id: 'time',         label: 'Time',            icon: Clock },
];

// --- SORTABLE ITEM COMPONENT ---
function SortableItem({ node, index, ans, answers, setAnswers, defaultDate, defaultHour, defaultMinute, currentPeriod }: any) {
  const itemId = node?.id || `node_${index}`;
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: itemId });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
    zIndex: isDragging ? 50 : 1,
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      className="p-2.5 bg-white rounded-lg border border-slate-200 shadow-sm relative group flex items-center gap-2"
    >
      {/* Left side middle Grab Handle */}
      <div 
        {...attributes} 
        {...listeners} 
        className="p-1 text-slate-400 hover:text-blue-600 cursor-grab active:cursor-grabbing rounded hover:bg-slate-50 shrink-0 select-none flex items-center justify-center"
        title="Drag to reorder"
      >
        <GripVertical className="w-4 h-4" />
      </div>

      <div className="flex-1 min-w-0">
        <label className="text-[12px] font-bold text-slate-700 block leading-snug mb-2">
          <span className="text-blue-600 mr-1">{index + 1}.</span>
          {node?.data?.label || 'Question'}
          {node?.data?.required && <span className="text-red-500 ml-1">*</span>}
        </label>

      {/* Input Fields Container */}
      <div onPointerDown={e => e.stopPropagation()} className="nopan">
        {node?.data?.type === 'Dropdown' ? (
          <select 
            className="w-full p-1.5 border border-slate-200 rounded-md text-[12px] bg-slate-50 text-slate-700 focus:border-blue-600 focus:outline-none" 
            value={ans || ''} 
            onChange={e => setAnswers((p: any) => ({ ...p, [node.id]: e.target.value }))}
          >
            <option value="" disabled>Select...</option>
            {(node.data.options || []).map((opt: any) => (
              <option key={opt.id} value={opt.label}>{opt.label}</option>
            ))}
          </select>
        ) : node?.data?.type === 'Number' ? (
          <input 
            type="number" 
            className="w-full p-1.5 border border-slate-200 rounded-md text-[12px] bg-slate-50 focus:border-blue-600 focus:outline-none" 
            placeholder="e.g. 5" 
            value={ans || ''} 
            onChange={e => setAnswers((p: any) => ({ ...p, [node.id]: e.target.value }))} 
          />
        ) : node?.data?.type === 'Long Text' ? (
          <textarea 
            className="w-full p-1.5 border border-slate-200 rounded-md text-[12px] bg-slate-50 focus:border-blue-600 focus:outline-none" 
            placeholder="Type answer..." 
            rows={2} 
            value={ans || ''} 
            onChange={e => setAnswers((p: any) => ({ ...p, [node.id]: e.target.value }))} 
          />
        ) : node?.data?.type === 'Date' ? (
          <input 
            type="date" 
            className="w-full p-1.5 border border-slate-200 rounded-md text-[12px] bg-slate-50 focus:border-blue-600 focus:outline-none" 
            value={ans || ''} 
            onChange={e => setAnswers((p: any) => ({ ...p, [node.id]: e.target.value }))} 
          />
        ) : node?.data?.type === 'Date & Time' ? (
          <div className="space-y-1.5">
            <input 
              type="date" 
              className="w-full p-1.5 border border-slate-200 rounded-md text-[12px] bg-slate-50 focus:border-blue-600 focus:outline-none" 
              value={ans?.date || defaultDate} 
              onChange={e => {
                const cur = ans && typeof ans === 'object' ? ans : { date: defaultDate, hour: defaultHour, minute: defaultMinute, period: currentPeriod };
                setAnswers((p: any) => ({ ...p, [node.id]: { ...cur, date: e.target.value } }));
              }} 
            />
            <div className="flex gap-1">
              <select 
                className="flex-1 p-1 border border-slate-200 rounded-md text-[11px] bg-slate-50 focus:border-blue-600 focus:outline-none text-slate-700 font-semibold"
                value={ans?.hour || defaultHour}
                onChange={e => {
                  const cur = ans && typeof ans === 'object' ? ans : { date: defaultDate, hour: defaultHour, minute: defaultMinute, period: currentPeriod };
                  setAnswers((p: any) => ({ ...p, [node.id]: { ...cur, hour: e.target.value } }));
                }}
              >
                {Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0')).map(h => (
                  <option key={h} value={h}>{h}</option>
                ))}
              </select>
              <span className="self-center text-slate-400 text-[11px] font-bold">:</span>
              <select 
                className="flex-1 p-1 border border-slate-200 rounded-md text-[11px] bg-slate-50 focus:border-blue-600 focus:outline-none text-slate-700 font-semibold"
                value={ans?.minute || defaultMinute}
                onChange={e => {
                  const cur = ans && typeof ans === 'object' ? ans : { date: defaultDate, hour: defaultHour, minute: defaultMinute, period: currentPeriod };
                  setAnswers((p: any) => ({ ...p, [node.id]: { ...cur, minute: e.target.value } }));
                }}
              >
                {Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0')).map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
              <select 
                className="p-1 border border-slate-200 rounded-md text-[11px] bg-slate-50 focus:border-blue-600 focus:outline-none text-slate-700 font-bold"
                value={ans?.period || currentPeriod}
                onChange={e => {
                  const cur = ans && typeof ans === 'object' ? ans : { date: defaultDate, hour: defaultHour, minute: defaultMinute, period: currentPeriod };
                  setAnswers((p: any) => ({ ...p, [node.id]: { ...cur, period: e.target.value } }));
                }}
              >
                <option value="AM">AM</option>
                <option value="PM">PM</option>
              </select>
            </div>
          </div>
        ) : node?.data?.type === 'Time' ? (
          <div className="flex gap-1">
            <select 
              className="flex-1 p-1.5 border border-slate-200 rounded-md text-[12px] bg-slate-50 focus:border-blue-600 focus:outline-none text-slate-700 font-semibold"
              value={ans?.hour || defaultHour}
              onChange={e => {
                const cur = ans && typeof ans === 'object' ? ans : { hour: defaultHour, minute: defaultMinute, period: currentPeriod };
                setAnswers((p: any) => ({ ...p, [node.id]: { ...cur, hour: e.target.value } }));
              }}
            >
              {Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0')).map(h => (
                <option key={h} value={h}>{h}</option>
              ))}
            </select>
            <span className="self-center text-slate-400 text-[12px] font-bold">:</span>
            <select 
              className="flex-1 p-1.5 border border-slate-200 rounded-md text-[12px] bg-slate-50 focus:border-blue-600 focus:outline-none text-slate-700 font-semibold"
              value={ans?.minute || defaultMinute}
              onChange={e => {
                const cur = ans && typeof ans === 'object' ? ans : { hour: defaultHour, minute: defaultMinute, period: currentPeriod };
                setAnswers((p: any) => ({ ...p, [node.id]: { ...cur, minute: e.target.value } }));
              }}
            >
              {Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0')).map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
            <select 
              className="p-1.5 border border-slate-200 rounded-md text-[12px] bg-slate-50 focus:border-blue-600 focus:outline-none text-slate-700 font-bold"
              value={ans?.period || currentPeriod}
              onChange={e => {
                const cur = ans && typeof ans === 'object' ? ans : { hour: defaultHour, minute: defaultMinute, period: currentPeriod };
                setAnswers((p: any) => ({ ...p, [node.id]: { ...cur, period: e.target.value } }));
              }}
            >
              <option value="AM">AM</option>
              <option value="PM">PM</option>
            </select>
          </div>
        ) : node?.data?.type === 'Image Attach' || node?.data?.type === 'Video Attach' ? (
          <div>
            <button 
              className="w-full p-3 border border-dashed border-slate-300 rounded-md flex flex-col items-center text-slate-500 bg-slate-50 hover:border-blue-600 transition-all" 
              onClick={() => setAnswers((p: any) => ({ ...p, [node.id]: 'uploaded' }))}
            >
              {node?.data?.type === 'Image Attach' ? <ImageIcon className="w-4 h-4 mb-0.5 text-blue-600" /> : <Video className="w-4 h-4 mb-0.5 text-blue-600" />}
              <span className="text-[10px] font-semibold">Upload {node?.data?.type?.split(' ')[0]}</span>
              {ans === 'uploaded' && <span className="text-[9px] text-green-500 font-bold">Attached</span>}
            </button>
            {node?.data?.maxSize && <p className="text-[9px] text-slate-400 mt-1 text-right">Max: {node.data.maxSize}MB</p>}
          </div>
        ) : (
          <input 
            type="text" 
            className="w-full p-1.5 border border-slate-200 rounded-md text-[12px] bg-slate-50 focus:border-blue-600 focus:outline-none" 
            placeholder="Type answer..." 
            value={ans || ''} 
            onChange={e => setAnswers((p: any) => ({ ...p, [node.id]: e.target.value }))} 
          />
        )}
      </div>
    </div>
    </div>
  );
}

// --- LIVE PREVIEW ---
function LivePreview({ nodes, onReorder, isMobileBuilder = false }: { nodes: any[], onReorder?: (newNodes: any[]) => void, isMobileBuilder?: boolean }) {
  const [answers, setAnswers] = useState<Record<string, any>>({});

  const now = new Date();
  let currentHour24 = now.getHours();
  const currentPeriod = currentHour24 >= 12 ? 'PM' : 'AM';
  let currentHour12 = currentHour24 % 12;
  if (currentHour12 === 0) currentHour12 = 12;
  const defaultHour = String(currentHour12).padStart(2, '0');
  const defaultMinute = String(now.getMinutes()).padStart(2, '0');
  const defaultDate = now.toISOString().split('T')[0];

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 200,
        tolerance: 5,
      },
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id && onReorder) {
      const oldIndex = nodes.findIndex((node) => node.id === active.id);
      const newIndex = nodes.findIndex((node) => node.id === over.id);
      if (oldIndex !== -1 && newIndex !== -1) {
        onReorder(arrayMove(nodes, oldIndex, newIndex));
      }
    }
  };

  return (
    <div className={`flex-1 p-4 overflow-y-auto ${isMobileBuilder ? 'bg-transparent w-full' : 'bg-[#F1F5F9]'} flex justify-center items-start`}>
      <div className={isMobileBuilder ? "w-full mx-auto relative flex flex-col" : "w-[290px] min-h-[560px] bg-white rounded-[28px] shadow-2xl border-[6px] border-slate-900 p-3 relative flex flex-col"}>
        {!isMobileBuilder && <div className="w-20 h-5 bg-slate-900 absolute top-[-2px] left-1/2 -translate-x-1/2 rounded-b-xl z-10"></div>}

        <div className={`mt-7 flex justify-between items-center mb-3 border-b ${isMobileBuilder ? 'border-slate-200 dark:border-slate-700 pb-4' : 'border-slate-100 pb-2'} px-1 shrink-0`}>
          <div>
            <h1 className={`${isMobileBuilder ? 'text-2xl' : 'text-[14px]'} font-bold text-slate-800 dark:text-slate-100 tracking-tight`}>{isMobileBuilder ? 'Mobile Builder' : 'Questionnaire Preview'}</h1>
            <p className="text-[10px] text-slate-400 font-medium">{nodes.length} questions</p>
          </div>
          {!isMobileBuilder && (
            <button onClick={() => setAnswers({})} className="text-blue-600 hover:bg-blue-50 p-1.5 rounded-full" title="Reset">
              <Play className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto px-1 space-y-3 pb-8">
          {nodes.length === 0 && (
            <p className="text-slate-400 text-xs text-center mt-8">Add nodes to see form.</p>
          )}

          <DndContext 
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext 
              items={nodes.map((n, i) => n?.id || `node_${i}`)} 
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-3">
                {nodes.map((node, index) => {
                  const itemId = node?.id || `node_${index}`;
                  return (
                    <SortableItem 
                      key={itemId}
                      node={node}
                      index={index}
                      ans={answers[itemId]}
                      answers={answers}
                      setAnswers={setAnswers}
                      defaultDate={defaultDate}
                      defaultHour={defaultHour}
                      defaultMinute={defaultMinute}
                      currentPeriod={currentPeriod}
                    />
                  );
                })}
              </div>
            </SortableContext>
          </DndContext>

          {nodes.length > 0 && (
            <button className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-[13px] font-bold rounded-xl shadow-md transition-all active:scale-95 mt-2">
              Submit Questionnaire
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function QuestionnaireBuilder() {
  const [nodes, setNodes] = useState<any[]>(initialNodes);
  const [edges, setEdges] = useState(initialEdges);
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const { screenToFlowPosition } = useReactFlow();

  const [questionnaireTitle, setQuestionnaireTitle] = useState('Daily Machine Checklist');
  const [isSaving, setIsSaving] = useState(false);
  const [activeMobileTab, setActiveMobileTab] = useState('questions'); // questions, settings, preview

  // Share Modal State
  const [showSharePopup, setShowSharePopup] = useState(false);
  const [isInviteMode, setIsInviteMode] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('Editor');
  const [notifyPeople, setNotifyPeople] = useState(true);
  const [inviteMessage, setInviteMessage] = useState('');
  const [emailChip, setEmailChip] = useState('');
  const [sharedUsers, setSharedUsers] = useState<any[]>([
    { email: 'rajraval22542@gmail.com', name: 'Mayur Raval (you)', role: 'Owner', isOwner: true, color: 'bg-[#1A73E8]', initial: 'M' }
  ]);

  const [scheduleType, setScheduleType] = useState('Daily');
  const [scheduleExceptions, setScheduleExceptions] = useState<string[]>([]);
  const [scheduleOccurrences, setScheduleOccurrences] = useState<string[]>(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']);
  const [scheduleMonthlyType, setScheduleMonthlyType] = useState('Date');
  // Multi-value: for Date = array of selected dates (1-31), for Interval = array of intervals
  const [scheduleMonthlyDates, setScheduleMonthlyDates] = useState<number[]>([1]);
  const [scheduleMonthlyIntervals, setScheduleMonthlyIntervals] = useState<number[]>([7]);

  const toggleMonthlyDate = (d: number) => setScheduleMonthlyDates(prev => prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d].sort((a,b)=>a-b));
  const toggleMonthlyInterval = (v: number) => setScheduleMonthlyIntervals(prev => prev.includes(v) ? prev.filter(x => x !== v) : [...prev, v].sort((a,b)=>a-b));
  const addMonthlyInterval = () => setScheduleMonthlyIntervals(prev => [...prev, 7]);
  const removeMonthlyInterval = (i: number) => setScheduleMonthlyIntervals(prev => prev.filter((_, idx) => idx !== i));
  const updateMonthlyInterval = (i: number, v: number) => setScheduleMonthlyIntervals(prev => prev.map((x, idx) => idx === i ? v : x));

  useEffect(() => {
    const saved = localStorage.getItem('nextick_schedule_defaults');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.exceptions) setScheduleExceptions(parsed.exceptions);
        if (parsed.occurrences) setScheduleOccurrences(parsed.occurrences);
        if (parsed.monthlyType) setScheduleMonthlyType(parsed.monthlyType);
        if (parsed.monthlyDates) setScheduleMonthlyDates(parsed.monthlyDates);
        if (parsed.monthlyIntervals) setScheduleMonthlyIntervals(parsed.monthlyIntervals);
      } catch (e) {}
    } else {
      setScheduleExceptions(['Sunday']);
    }
  }, []);

  const saveAsDefault = () => {
    const data = {
      exceptions: scheduleExceptions,
      occurrences: scheduleOccurrences,
      monthlyType: scheduleMonthlyType,
      monthlyDates: scheduleMonthlyDates,
      monthlyIntervals: scheduleMonthlyIntervals,
    };
    localStorage.setItem('nextick_schedule_defaults', JSON.stringify(data));
    alert('Schedule saved as Global Default for new ticksheets!');
  };

  const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const searchParams = useSearchParams();
  const editId = searchParams.get('id');

  const onNodesChange = useCallback((changes: any) => setNodes(nds => applyNodeChanges(changes, nds)), []);
  const onEdgesChange = useCallback((changes: any) => setEdges(eds => applyEdgeChanges(changes, eds)), []);
  const onConnect = useCallback((params: any) => setEdges(eds => addEdge(params, eds)), []);

  const handleSaveQuestionnaire = async () => {
    setIsSaving(true);
    // Simulating save for frontend only
    setTimeout(() => {
      alert('Questionnaire saved successfully!');
      setIsSaving(false);
    }, 800);
  };

  const onDragStart = (event: any, nodeType: string, label: string) => {
    event.dataTransfer.setData('application/reactflow', JSON.stringify({ type: nodeType, label }));
    event.dataTransfer.effectAllowed = 'move';
  };

  const onDragOver = useCallback((event: any) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: any) => {
      event.preventDefault();
      const typeData = event.dataTransfer.getData('application/reactflow');
      if (!typeData) return;
      const { type, label } = JSON.parse(typeData);
      const position = screenToFlowPosition({ x: event.clientX, y: event.clientY });
      const offset = (nodes.length % 5) * 30;
      const newNode = {
        id: getId(),
        type: 'question',
        position: { x: position.x + offset, y: position.y + offset },
        data: {
          label: `New ${label}`,
          type: label,
          required: false,
          frequency: 'Daily',
          ...(label === 'Dropdown' || label === 'Multiple Option' ? { options: [{ id: `opt_${Date.now()}`, label: 'Option 1' }] } : {}),
          ...(label === 'Image Attach' || label === 'Video Attach' ? { maxSize: 5 } : {}),
          reportFormats: [],
        },
      };
      setNodes(nds => nds.concat(newNode));
    },
    [screenToFlowPosition, nodes.length],
  );

  return (
    <div className="h-full w-full flex overflow-hidden bg-transparent text-slate-800 font-sans">
      {/* TOOLBOX SIDEBAR */}
      <aside className="hidden md:flex w-[250px] bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-r border-slate-200/50 dark:border-slate-800/50 flex-col h-full shrink-0 shadow-sm z-10">
        <div className="p-3 border-b border-slate-200/50 dark:border-slate-800/50 space-y-3">
          <input
            type="text"
            className="w-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-md p-2 text-[13px] font-bold text-slate-700 dark:text-slate-200 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all"
            value={questionnaireTitle}
            onChange={(e) => setQuestionnaireTitle(e.target.value)}
            placeholder="Questionnaire Title"
          />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-8 h-4 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">Draft</span>
            </div>
            <button 
              onClick={handleSaveQuestionnaire}
              disabled={isSaving}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-3 py-1.5 rounded-md text-[12px] font-bold transition-all shadow-sm active:scale-95 flex items-center gap-1"
            >
              <Save className="w-3 h-3" /> {isSaving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-3">
          
          {/* SCHEDULE MODULE — Accordion style */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-hidden shadow-sm">
            {/* Header */}
            <div className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-3 py-2.5 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-500" />
              <span className="text-[12px] font-bold text-slate-700 dark:text-slate-200">This Ticksheet Schedules</span>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-700/50">

              {/* DAILY */}
              <details className="group">
                <summary className="flex items-center gap-2 p-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors list-none">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400 inline-block shrink-0"></span>
                  <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 flex-1 min-w-0 truncate">Daily Exceptions</span>
                  <span className="ml-auto text-[9px] font-bold text-slate-400 group-open:hidden shrink-0 whitespace-nowrap">{scheduleExceptions.length} skip days</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1 group-open:-rotate-180 transition-transform shrink-0" />
                </summary>
                <div className="px-3 pb-3 pt-0">
                  <div className="flex flex-wrap gap-1">
                    {DAYS.map(day => (
                      <button
                        key={day}
                        onClick={() => setScheduleExceptions(prev => prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day])}
                        className={`px-2 py-1 text-[10px] font-bold rounded-md border transition-all ${
                          scheduleExceptions.includes(day)
                            ? 'bg-red-500 border-red-500 text-white shadow-sm'
                            : 'bg-white border-slate-200 text-slate-500 hover:border-red-300 hover:text-red-500 dark:bg-slate-800 dark:border-slate-600'
                        }`}
                      >
                        {day.substring(0, 3)}
                      </button>
                    ))}
                  </div>
                </div>
              </details>

              {/* WEEKLY */}
              <details className="group">
                <summary className="flex items-center gap-2 p-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors list-none">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400 inline-block shrink-0"></span>
                  <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 flex-1 min-w-0 truncate">Weekly Occurrences</span>
                  <span className="ml-auto text-[9px] font-bold text-slate-400 group-open:hidden shrink-0 whitespace-nowrap">{scheduleOccurrences.length} days active</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1 group-open:-rotate-180 transition-transform shrink-0" />
                </summary>
                <div className="px-3 pb-3 pt-0">
                  <div className="flex flex-wrap gap-1">
                    {DAYS.map(day => (
                      <button
                        key={day}
                        onClick={() => setScheduleOccurrences(prev => prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day])}
                        className={`px-2 py-1 text-[10px] font-bold rounded-md border transition-all ${
                          scheduleOccurrences.includes(day)
                            ? 'bg-blue-500 border-blue-500 text-white shadow-sm'
                            : 'bg-white border-slate-200 text-slate-500 hover:border-blue-300 hover:text-blue-500 dark:bg-slate-800 dark:border-slate-600'
                        }`}
                      >
                        {day.substring(0, 3)}
                      </button>
                    ))}
                  </div>
                </div>
              </details>

              {/* MONTHLY */}
              <details className="group">
                <summary className="flex items-center gap-2 p-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors list-none">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400 inline-block shrink-0"></span>
                  <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 flex-1 min-w-0 truncate">Monthly Rule</span>
                  <span className="ml-auto text-[9px] font-bold text-slate-400 group-open:hidden shrink-0 whitespace-nowrap">{scheduleMonthlyType}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1 group-open:-rotate-180 transition-transform shrink-0" />
                </summary>
                <div className="px-3 pb-3 pt-0 space-y-2">
                  <select
                    className="w-full p-1.5 border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 rounded-lg text-[11px] text-slate-700 dark:text-slate-300 font-medium focus:outline-none focus:border-blue-400"
                    value={scheduleMonthlyType}
                    onChange={(e) => setScheduleMonthlyType(e.target.value)}
                  >
                    <option value="Date">On Date(s)</option>
                    <option value="Interval">Every X Days</option>
                  </select>

                  {scheduleMonthlyType === 'Date' && (
                    <div className="grid grid-cols-7 gap-0.5 pt-1">
                      {Array.from({ length: 31 }, (_, i) => i + 1).map(d => (
                        <button key={d} onClick={() => toggleMonthlyDate(d)}
                          className={`py-1 text-[9px] font-bold rounded border transition-all ${
                            scheduleMonthlyDates.includes(d)
                              ? 'bg-blue-500 border-blue-500 text-white'
                              : 'bg-white border-slate-200 text-slate-400 hover:bg-blue-50 hover:border-blue-300 dark:bg-slate-800 dark:border-slate-600 dark:text-slate-400'
                          }`}
                        >{d}</button>
                      ))}
                    </div>
                  )}

                  {scheduleMonthlyType === 'Interval' && (
                    <div className="space-y-1.5 pt-1">
                      {scheduleMonthlyIntervals.map((val, i) => (
                        <div key={i} className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700 rounded-lg p-1.5">
                          <span className="text-[10px] font-medium text-slate-400 shrink-0">Every</span>
                          <input type="number" min="1" max="365"
                            className="w-12 p-1 border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 rounded text-[11px] text-slate-700 dark:text-slate-300 font-bold text-center focus:outline-none focus:border-blue-400"
                            value={val}
                            onChange={(e) => updateMonthlyInterval(i, Number(e.target.value))}
                          />
                          <span className="text-[10px] font-medium text-slate-400 flex-1">days</span>
                          {scheduleMonthlyIntervals.length > 1 && (
                            <button onClick={() => removeMonthlyInterval(i)} className="w-5 h-5 flex items-center justify-center text-red-400 hover:text-red-600 hover:bg-red-50 rounded transition-all text-[10px] font-bold">✕</button>
                          )}
                        </div>
                      ))}
                      <button onClick={addMonthlyInterval} className="w-full py-1.5 text-[10px] font-bold text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg border border-dashed border-blue-200 transition-all flex items-center justify-center gap-1">
                        <Plus className="w-3 h-3" /> Add Interval
                      </button>
                    </div>
                  )}
                </div>
              </details>
            </div>

            {/* Save Default Footer */}
            <button onClick={saveAsDefault} className="w-full py-2.5 bg-slate-50 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-[10px] font-bold text-blue-600 transition-all border-t border-slate-200 dark:border-slate-700 flex items-center justify-center gap-1.5">
              <Save className="w-3.5 h-3.5" /> Save as Default For this ticksheet
            </button>
          </div>

          {/* FORM FIELDS */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-hidden shadow-sm">
            <div className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-3 py-2.5 flex items-center gap-2">
              <Layers className="w-4 h-4 text-purple-500" />
              <span className="text-[12px] font-bold text-slate-700 dark:text-slate-200">Form Fields</span>
              <span className="ml-auto text-[9px] font-medium text-slate-400">Drag to canvas</span>
            </div>
            <div className="p-2 grid grid-cols-2 gap-1.5">
              {FIELD_TYPES.map(item => (
                <div
                  key={item.id}
                  draggable
                  onDragStart={e => onDragStart(e, item.id, item.label)}
                  className="flex items-center gap-2 px-2.5 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200/50 dark:border-slate-600 rounded-lg cursor-grab hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 dark:hover:bg-blue-900/20 dark:hover:border-blue-700 transition-all group active:scale-95"
                >
                  <item.icon className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-500 transition-colors shrink-0" />
                  <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 group-hover:text-blue-600 transition-colors leading-tight">{item.label}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </aside>

      {/* DESKTOP CANVAS */}
      <main className="hidden md:block flex-1 relative" ref={reactFlowWrapper}>
        
        {/* Share Button (Top Right corner of canvas, left of mobile preview) */}
        <div className="absolute top-4 right-4 z-[60]">
          <button 
            onClick={() => setShowSharePopup(true)} 
            className="flex items-center gap-2 bg-[#C2E7FF] hover:bg-[#A8DDFD] dark:bg-blue-900 dark:hover:bg-blue-800 text-[#001D35] dark:text-blue-100 px-5 py-2.5 rounded-full text-sm font-medium transition-all shadow-sm active:scale-95 border border-[#C2E7FF]/50"
          >
            <Share2 className="w-4 h-4" /> Share
          </button>
        </div>

        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onDrop={onDrop}
          onDragOver={onDragOver}
          nodeTypes={nodeTypes}
          fitView
          minZoom={0.2}
          defaultEdgeOptions={{ style: { strokeWidth: 2, stroke: '#2563eb' }, animated: true }}
        >
          <Background color="#cbd5e1" gap={24} size={1.5} />
          <Controls className="!bg-white dark:!bg-slate-800 !border-slate-200 dark:!border-slate-700 !shadow-lg rounded-lg overflow-hidden" />
        </ReactFlow>
      </main>

      {/* MOBILE LIST BUILDER (Google Forms Style) */}
      <div className="flex md:hidden flex-col flex-1 w-full h-full bg-slate-50/50 dark:bg-[#0B1120] overflow-hidden relative z-50">
         {/* Mobile Header / Tabs */}
         <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-4 pt-4 flex flex-col shrink-0">
           <input 
             type="text" 
             className="w-full bg-transparent text-xl font-extrabold text-slate-800 dark:text-white focus:outline-none mb-4"
             value={questionnaireTitle}
             onChange={(e) => setQuestionnaireTitle(e.target.value)}
             placeholder="Questionnaire Title"
           />
           <div className="flex items-center gap-6 overflow-x-auto hide-scrollbar">
             {['questions', 'settings', 'preview'].map(tab => (
               <button 
                 key={tab}
                 onClick={() => setActiveMobileTab(tab)}
                 className={`pb-3 text-sm font-bold capitalize whitespace-nowrap transition-colors border-b-2 ${activeMobileTab === tab ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
               >
                 {tab}
               </button>
             ))}
           </div>
         </div>

         {/* Mobile Content Area */}
         <div className="flex-1 overflow-y-auto p-4 relative">
           {activeMobileTab === 'questions' && (
             <div className="space-y-4 pb-24">
               {nodes.map((node, i) => (
                 <div key={node.id} className="relative">
                   <QuestionNode id={node.id} data={node.data} isConnectable={false} index={i} />
                 </div>
               ))}
               <button 
                 onClick={() => {
                   const newNode = {
                     id: getId(), type: 'question', position: { x: 0, y: 0 },
                     data: { label: '', type: 'Short Text', required: false }
                   };
                   setNodes(nds => [...nds, newNode]);
                 }}
                 className="w-full bg-white dark:bg-slate-800 border-2 border-dashed border-blue-300 dark:border-slate-600 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-600 dark:text-blue-400 py-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 shadow-sm"
               >
                 <Plus className="w-5 h-5" /> Add New Question
               </button>
             </div>
           )}

           {activeMobileTab === 'settings' && (
             <div className="pb-24">
               {/* SCHEDULE MODULE — Accordion style (Copied from Desktop Sidebar) */}
               <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-hidden shadow-sm">
                 <div className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-3 py-2.5 flex items-center gap-2">
                   <Calendar className="w-4 h-4 text-blue-500" />
                   <span className="text-[12px] font-bold text-slate-700 dark:text-slate-200">This Ticksheet Schedules</span>
                 </div>
                 <div className="divide-y divide-slate-100 dark:divide-slate-700/50">
                   {/* DAILY */}
                   <details className="group">
                     <summary className="flex items-center gap-2 p-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors list-none">
                       <span className="w-1.5 h-1.5 rounded-full bg-red-400 inline-block shrink-0"></span>
                       <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 flex-1 min-w-0 truncate">Daily Exceptions</span>
                       <span className="ml-auto text-[9px] font-bold text-slate-400 group-open:hidden shrink-0 whitespace-nowrap">{scheduleExceptions.length} skip days</span>
                       <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1 group-open:-rotate-180 transition-transform shrink-0" />
                     </summary>
                     <div className="px-3 pb-3 pt-0">
                       <div className="flex flex-wrap gap-1">
                         {DAYS.map(day => (
                           <button key={day} onClick={() => setScheduleExceptions(prev => prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day])}
                             className={`px-2 py-1 text-[10px] font-bold rounded-md border transition-all ${scheduleExceptions.includes(day) ? 'bg-red-500 border-red-500 text-white shadow-sm' : 'bg-white border-slate-200 text-slate-500'}`}>
                             {day.substring(0, 3)}
                           </button>
                         ))}
                       </div>
                     </div>
                   </details>
                   {/* WEEKLY */}
                   <details className="group">
                     <summary className="flex items-center gap-2 p-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors list-none">
                       <span className="w-1.5 h-1.5 rounded-full bg-blue-400 inline-block shrink-0"></span>
                       <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 flex-1 min-w-0 truncate">Weekly Occurrences</span>
                       <span className="ml-auto text-[9px] font-bold text-slate-400 group-open:hidden shrink-0 whitespace-nowrap">{scheduleOccurrences.length} days active</span>
                       <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1 group-open:-rotate-180 transition-transform shrink-0" />
                     </summary>
                     <div className="px-3 pb-3 pt-0">
                       <div className="flex flex-wrap gap-1">
                         {DAYS.map(day => (
                           <button key={day} onClick={() => setScheduleOccurrences(prev => prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day])}
                             className={`px-2 py-1 text-[10px] font-bold rounded-md border transition-all ${scheduleOccurrences.includes(day) ? 'bg-blue-500 border-blue-500 text-white shadow-sm' : 'bg-white border-slate-200 text-slate-500'}`}>
                             {day.substring(0, 3)}
                           </button>
                         ))}
                       </div>
                     </div>
                    </details>
                   {/* MONTHLY */}
                   <details className="group">
                     <summary className="flex items-center gap-2 p-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors list-none">
                       <span className="w-1.5 h-1.5 rounded-full bg-purple-400 inline-block shrink-0"></span>
                       <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 flex-1 min-w-0 truncate">Monthly Rule</span>
                       <span className="ml-auto text-[9px] font-bold text-slate-400 group-open:hidden shrink-0 whitespace-nowrap">{scheduleMonthlyType}</span>
                       <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1 group-open:-rotate-180 transition-transform shrink-0" />
                     </summary>
                     <div className="px-3 pb-3 pt-0 space-y-2">
                       <select
                         className="w-full p-1.5 border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 rounded-lg text-[11px] text-slate-700 dark:text-slate-300 font-medium focus:outline-none focus:border-blue-400"
                         value={scheduleMonthlyType}
                         onChange={(e) => setScheduleMonthlyType(e.target.value)}
                       >
                         <option value="Date">On Date(s)</option>
                         <option value="Interval">Every X Days</option>
                       </select>

                       {scheduleMonthlyType === 'Date' && (
                         <div className="grid grid-cols-7 gap-0.5 pt-1">
                           {Array.from({ length: 31 }, (_, i) => i + 1).map(d => (
                             <button key={d} onClick={() => {
                               setScheduleMonthlyDates(prev => prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d].sort((a,b)=>a-b))
                             }}
                               className={`py-1 text-[9px] font-bold rounded border transition-all ${
                                 scheduleMonthlyDates.includes(d)
                                   ? 'bg-blue-500 border-blue-500 text-white'
                                   : 'bg-white border-slate-200 text-slate-400 hover:bg-blue-50 hover:border-blue-300 dark:bg-slate-800 dark:border-slate-600 dark:text-slate-400'
                               }`}
                             >{d}</button>
                           ))}
                         </div>
                       )}

                       {scheduleMonthlyType === 'Interval' && (
                         <div className="space-y-1.5 pt-1">
                           {scheduleMonthlyIntervals.map((val, i) => (
                             <div key={i} className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700 rounded-lg p-1.5">
                               <span className="text-[10px] font-medium text-slate-400 shrink-0">Every</span>
                               <input type="number" min="1" max="365"
                                 className="w-12 p-1 border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 rounded text-[11px] text-slate-700 dark:text-slate-300 font-bold text-center focus:outline-none focus:border-blue-400"
                                 value={val}
                                 onChange={(e) => {
                                   const newArr = [...scheduleMonthlyIntervals];
                                   newArr[i] = Number(e.target.value);
                                   setScheduleMonthlyIntervals(newArr);
                                 }}
                               />
                               <span className="text-[10px] font-medium text-slate-400 flex-1">days</span>
                               {scheduleMonthlyIntervals.length > 1 && (
                                 <button onClick={() => {
                                   setScheduleMonthlyIntervals(prev => prev.filter((_, idx) => idx !== i))
                                 }} className="w-5 h-5 flex items-center justify-center text-red-400 hover:text-red-600 hover:bg-red-50 rounded transition-all text-[10px] font-bold">✕</button>
                               )}
                             </div>
                           ))}
                           <button onClick={() => setScheduleMonthlyIntervals(prev => [...prev, 7])} className="w-full py-1.5 text-[10px] font-bold text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg border border-dashed border-blue-200 transition-all flex items-center justify-center gap-1">
                             <Plus className="w-3 h-3" /> Add Interval
                           </button>
                         </div>
                       )}
                     </div>
                   </details>
                 </div>
                 <button onClick={saveAsDefault} className="w-full py-2.5 bg-slate-50 dark:bg-slate-800 hover:bg-blue-50 text-[10px] font-bold text-blue-600 transition-all border-t border-slate-200 dark:border-slate-700 flex items-center justify-center gap-1.5">
                   <Save className="w-3.5 h-3.5" /> Save as Default For this ticksheet
                 </button>
               </div>
             </div>
           )}

           {activeMobileTab === 'preview' && (
             <div className="pb-24 -m-4 h-[calc(100%+2rem)]">
               <LivePreview nodes={nodes} onReorder={setNodes} isMobileBuilder={true} />
             </div>
           )}
         </div>

         {/* Fixed Save Button */}
         {activeMobileTab !== 'preview' && (
           <div className="absolute bottom-0 left-0 w-full p-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 shadow-[0_-10px_30px_-10px_rgba(0,0,0,0.1)]">
             <button 
               onClick={handleSaveQuestionnaire}
               disabled={isSaving}
               className="w-full bg-blue-600 hover:bg-blue-700 text-white px-5 py-3.5 rounded-xl text-sm font-bold shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 transition-transform active:scale-95"
             >
               {isSaving ? 'Saving...' : <><Save className="w-4 h-4" /> Save Ticksheet</>}
             </button>
           </div>
         )}
      </div>

      {/* RIGHT PANEL: Live Preview */}
      <aside className="w-[340px] border-l border-slate-200/50 dark:border-slate-800/50 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md flex flex-col shadow-sm z-10 hidden 2xl:flex">
        <LivePreview nodes={nodes} onReorder={setNodes} />
      </aside>

      {/* SHARE MODAL (Google Docs Style) */}
      {showSharePopup && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-800 rounded-[16px] shadow-2xl w-full max-w-[550px] overflow-hidden flex flex-col animate-in zoom-in-95 duration-200 min-h-[400px]">
            {/* Header */}
            <div className="px-5 pt-5 pb-3 flex items-center justify-between">
              <h2 className="text-[22px] font-normal text-slate-800 dark:text-slate-100 truncate pr-4">
                {isInviteMode ? (
                  <div className="flex items-center gap-3">
                    <button onClick={() => setIsInviteMode(false)} className="text-slate-600 hover:bg-slate-100 p-2 -ml-2 rounded-full transition-colors"><ArrowLeft className="w-5 h-5" /></button>
                    <span>Share "{questionnaireTitle || 'Untitled Ticksheet'}"</span>
                  </div>
                ) : (
                  <span>Share "{questionnaireTitle || 'Untitled Ticksheet'}"</span>
                )}
              </h2>
              <div className="flex items-center gap-1 shrink-0">
                <button className="text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 p-2 rounded-full transition-colors"><HelpCircle className="w-5 h-5" /></button>
                <button className="text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 p-2 rounded-full transition-colors"><Settings className="w-5 h-5" /></button>
              </div>
            </div>

            {/* List Mode Content */}
            {!isInviteMode && (
              <div className="px-5 space-y-6 pb-4">
                {/* Fake Input */}
                <div 
                  className="border border-slate-300 dark:border-slate-600 rounded-[4px] p-0.5 hover:border-slate-800 cursor-text flex items-center transition-colors"
                  onClick={() => setIsInviteMode(true)}
                >
                  <input 
                    type="text" 
                    placeholder="Add people, groups, spaces and calendar events"
                    className="w-full bg-transparent p-2.5 text-[14px] focus:outline-none text-slate-800 placeholder:text-slate-600 pointer-events-none"
                    readOnly
                  />
                </div>

                {/* People with access */}
                <div>
                  <h3 className="text-[14px] font-medium text-slate-800 dark:text-slate-200 mb-3">People with access</h3>
                  <div className="space-y-1">
                    {sharedUsers.map(user => (
                      <div key={user.email} className="flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700/50 p-2 -mx-2 rounded-lg transition-colors group/user">
                        <div className="flex items-center gap-3">
                          <div className={`w-[36px] h-[36px] rounded-full ${user.color} text-white flex items-center justify-center font-semibold text-[15px] shrink-0`}>
                            {user.initial}
                          </div>
                          <div className="flex flex-col justify-center">
                            <p className="text-[14px] font-medium text-slate-800 dark:text-slate-200 leading-tight">{user.name}</p>
                            <p className="text-[12px] text-slate-500 mt-0.5">{user.email}</p>
                          </div>
                        </div>
                        {user.isOwner ? (
                          <span className="text-[13px] text-slate-500 font-medium pr-2">Owner</span>
                        ) : (
                          <div className="relative flex items-center">
                            <select 
                              className="appearance-none bg-transparent text-[14px] text-slate-600 font-medium focus:outline-none cursor-pointer pr-6 py-1"
                              value={user.role}
                              onChange={(e) => {
                                if(e.target.value === 'Remove access') {
                                  setSharedUsers(prev => prev.filter(u => u.email !== user.email));
                                } else {
                                  setSharedUsers(prev => prev.map(u => u.email === user.email ? { ...u, role: e.target.value } : u));
                                }
                              }}
                            >
                              <option value="Viewer">Viewer</option>
                              <option value="Commenter">Commenter</option>
                              <option value="Editor">Editor</option>
                              <option disabled>──────────</option>
                              <option value="Transfer ownership">Transfer ownership</option>
                              <option value="Remove access">Remove access</option>
                            </select>
                            <ChevronDown className="w-3.5 h-3.5 absolute right-1 pointer-events-none text-slate-600" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Invite Mode Content */}
            {isInviteMode && (
              <div className="px-5 space-y-5 pb-4 flex-1">
                {/* Email Input & Role */}
                <div className="flex items-start gap-3">
                  <div className={`flex-1 border rounded-[4px] p-1 flex flex-wrap gap-1 items-center min-h-[46px] transition-all ${emailChip ? 'border-slate-300' : 'border-blue-600 shadow-[0_0_0_1px_rgba(37,99,235,1)]'}`}>
                    {emailChip ? (
                      <div className="flex items-center gap-1.5 bg-[#C2E7FF]/50 border border-[#A8DDFD] rounded-full pl-1.5 pr-2.5 py-0.5 m-1">
                          <div className="w-5 h-5 rounded-full bg-[#007b83] text-white flex items-center justify-center text-[10px] font-bold">
                            {emailChip.charAt(0).toUpperCase()}
                          </div>
                          <span className="text-[13px] font-medium text-[#001D35]">{emailChip}</span>
                          <button className="text-slate-500 hover:text-slate-700 ml-1" onClick={() => setEmailChip('')}><X className="w-3.5 h-3.5" /></button>
                      </div>
                    ) : (
                      <input 
                        autoFocus
                        type="text" 
                        placeholder="Add people, groups, spaces and calendar events"
                        className="flex-1 bg-transparent p-2 text-[14px] focus:outline-none min-w-[150px] text-slate-800 placeholder:text-slate-500"
                        value={inviteEmail}
                        onChange={e => setInviteEmail(e.target.value)}
                        onKeyDown={(e) => {
                          if(e.key === 'Enter' || e.key === 'Tab' || e.key === ' ' || e.key === ',') {
                            e.preventDefault();
                            if(inviteEmail.trim()) {
                              setEmailChip(inviteEmail.trim());
                              setInviteEmail('');
                            }
                          }
                        }}
                        onBlur={() => {
                          if(inviteEmail.trim() && !emailChip) {
                            setEmailChip(inviteEmail.trim());
                            setInviteEmail('');
                          }
                        }}
                      />
                    )}
                  </div>
                  <div className="relative flex items-center bg-slate-50 hover:bg-slate-100 rounded-[4px] border border-transparent mt-1">
                    <select 
                      className="appearance-none bg-transparent text-[14px] text-slate-700 font-medium focus:outline-none cursor-pointer pl-3 pr-8 py-2"
                      value={inviteRole}
                      onChange={(e) => setInviteRole(e.target.value)}
                    >
                      <option value="Viewer">Viewer</option>
                      <option value="Commenter">Commenter</option>
                      <option value="Editor">Editor</option>
                    </select>
                    <ChevronDown className="w-4 h-4 absolute right-2 pointer-events-none text-slate-600" />
                  </div>
                </div>

                {/* Notify & Message */}
                <div className="space-y-4 px-1">
                  <div className="flex items-center gap-3">
                    <input 
                      type="checkbox" 
                      id="notify" 
                      checked={notifyPeople} 
                      onChange={e => setNotifyPeople(e.target.checked)} 
                      className="w-[18px] h-[18px] text-[#0B57D0] rounded-[2px] border-slate-400 focus:ring-0 cursor-pointer accent-[#0B57D0]"
                    />
                    <label htmlFor="notify" className="text-[14px] text-slate-800 cursor-pointer select-none">Notify people</label>
                  </div>
                  {notifyPeople && (
                    <textarea 
                      placeholder="Message"
                      className="w-full border border-slate-300 rounded-[4px] p-3 text-[14px] min-h-[120px] focus:outline-none focus:border-blue-600 focus:shadow-[0_0_0_1px_rgba(37,99,235,1)] text-slate-800 resize-none"
                      value={inviteMessage}
                      onChange={e => setInviteMessage(e.target.value)}
                    />
                  )}
                </div>
              </div>
            )}

            {/* List Mode Footer */}
            {!isInviteMode && (
              <div className="px-5 py-4 flex items-center justify-between mt-auto">
                <button className="text-slate-700 font-medium text-[14px] hover:bg-slate-100 px-3 py-2 rounded-full transition-colors flex items-center gap-2">
                  <Link className="w-4 h-4" /> Copy link
                </button>
                <button 
                  onClick={() => setShowSharePopup(false)}
                  className="text-[#0B57D0] hover:bg-[#C2E7FF]/50 px-6 py-2.5 rounded-full text-[14px] font-medium transition-colors"
                >
                  Done
                </button>
              </div>
            )}

            {/* Invite Mode Footer */}
            {isInviteMode && (
              <div className="px-5 py-4 flex items-center justify-between mt-auto">
                <button className="text-slate-700 font-medium text-[14px] hover:bg-slate-100 px-3 py-2 rounded-full transition-colors flex items-center gap-2">
                  <Link className="w-4 h-4" /> Copy link
                </button>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => {
                      setIsInviteMode(false);
                      setEmailChip('');
                      setInviteEmail('');
                    }}
                    className="text-[#0B57D0] hover:bg-[#C2E7FF]/50 px-5 py-2.5 rounded-full text-[14px] font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={() => {
                      const emailToInvite = emailChip || inviteEmail.trim();
                      if(emailToInvite) {
                        setSharedUsers(prev => {
                          const existing = prev.find(u => u.email === emailToInvite);
                          if(existing) return prev;
                          return [...prev, {
                            email: emailToInvite,
                            name: emailToInvite,
                            role: inviteRole,
                            isOwner: false,
                            color: 'bg-[#8E24AA]',
                            initial: emailToInvite.charAt(0).toUpperCase()
                          }];
                        });
                      }
                      setIsInviteMode(false);
                      setEmailChip('');
                      setInviteEmail('');
                      setInviteMessage('');
                    }}
                    className="bg-[#0B57D0] hover:bg-[#0842A0] text-white px-6 py-2.5 rounded-full text-[14px] font-medium transition-colors disabled:opacity-50"
                    disabled={!emailChip && !inviteEmail.trim()}
                  >
                    Send
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}

export default function QuestionnaireBuilderPage() {
  return (
    <ReactFlowProvider>
      <Suspense fallback={<div className="h-full flex items-center justify-center bg-transparent text-slate-500 font-bold">Loading Builder...</div>}>
        <QuestionnaireBuilder />
      </Suspense>
    </ReactFlowProvider>
  );
}
