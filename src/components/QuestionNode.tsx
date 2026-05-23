import React, { useState, useEffect } from 'react';
import { useReactFlow } from '@xyflow/react';
import { List, Copy, Trash2, Plus, Hash, Type, FileText, Image as ImageIcon, Video, CheckSquare, ChevronDown, PaintBucket, Bold, Type as TypeIcon, Calendar, CalendarClock, Clock } from 'lucide-react';

const COLORS = [
  '#ef4444', '#f97316', '#f59e0b', '#eab308', '#84cc16', '#22c55e', '#10b981', 
  '#14b8a6', '#06b6d4', '#0ea5e9', '#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', 
  '#d946ef', '#ec4899', '#f43f5e', '#ffffff', '#e2e8f0', '#94a3b8', '#475569', '#0f172a'
];

function ColorPicker({ color, onChange, label, icon: Icon }: any) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 p-1.5 border border-slate-200 rounded-md bg-white hover:bg-slate-50 transition-colors nodrag"
        title={label}
      >
        <Icon className="w-3.5 h-3.5 text-slate-500" />
        <div className="w-4 h-4 rounded-sm border border-slate-200" style={{ backgroundColor: color || '#ffffff' }}></div>
      </button>
      {isOpen && (
        <div className="absolute top-full left-0 mt-1 p-2 bg-white border border-slate-200 rounded-lg shadow-xl grid grid-cols-6 gap-1 z-50 w-[160px]">
          {COLORS.map(c => (
            <div 
              key={c} 
              onClick={() => { onChange(c); setIsOpen(false); }}
              className="w-5 h-5 rounded cursor-pointer border border-slate-200 hover:scale-110 transition-transform" 
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// Custom input that only pushes to global state on Blur to prevent lag/focus loss
function DebouncedInput({ value, onChange, className, placeholder, type = "text" }: any) {
  const [localVal, setLocalVal] = useState(value);
  
  useEffect(() => {
    setLocalVal(value);
  }, [value]);

  return (
    <input 
      type={type}
      className={className}
      placeholder={placeholder}
      value={localVal}
      onChange={(e) => setLocalVal(e.target.value)}
      onBlur={() => onChange(type === 'number' ? Number(localVal) : localVal)}
    />
  );
}

export default function QuestionNode({ id, data, isConnectable }: any) {
  const { setNodes, setEdges } = useReactFlow();
  
  const [localLabel, setLocalLabel] = useState(data.label || '');

  useEffect(() => {
    setLocalLabel(data.label || '');
  }, [data.label]);

  const updateNodeData = (newData: any) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === id) {
          return { ...node, data: { ...node.data, ...newData } };
        }
        return node;
      })
    );
  };

  const onDelete = () => {
    setNodes((nodes) => nodes.filter((node) => node.id !== id));
    setEdges((edges) => edges.filter((edge) => edge.source !== id && edge.target !== id));
  };

  const onDuplicate = () => {
    setNodes((nodes) => {
      const nodeToDuplicate = nodes.find((n) => n.id === id);
      if (!nodeToDuplicate) return nodes;
      
      const newNode = {
        ...nodeToDuplicate,
        id: `${id}-copy-${Date.now()}`,
        position: {
          x: nodeToDuplicate.position.x + 40,
          y: nodeToDuplicate.position.y + 40,
        },
        data: { ...nodeToDuplicate.data, label: `${nodeToDuplicate.data.label} (Copy)` }
      };
      return [...nodes, newNode];
    });
  };

  const getIcon = (type: string) => {
    switch(type) {
      case 'Number': return <Hash className="w-4 h-4 text-primary" />;
      case 'Dropdown': return <ChevronDown className="w-4 h-4 text-primary" />;
      case 'Multiple Option': return <CheckSquare className="w-4 h-4 text-primary" />;
      case 'Image Attach': return <ImageIcon className="w-4 h-4 text-primary" />;
      case 'Video Attach': return <Video className="w-4 h-4 text-primary" />;
      case 'Long Text': return <FileText className="w-4 h-4 text-primary" />;
      case 'Date': return <Calendar className="w-4 h-4 text-primary" />;
      case 'Date & Time': return <CalendarClock className="w-4 h-4 text-primary" />;
      case 'Time': return <Clock className="w-4 h-4 text-primary" />;
      default: return <Type className="w-4 h-4 text-primary" />;
    }
  };

  const addOption = () => {
    const opts = data.options || [];
    updateNodeData({ options: [...opts, { id: `opt_${Date.now()}`, label: `Option ${opts.length + 1}` }] });
  };

  const updateOption = (optId: string, val: string) => {
    const opts = data.options.map((o: any) => o.id === optId ? { ...o, label: val } : o);
    updateNodeData({ options: opts });
  };

  const removeOption = (optId: string) => {
    const opts = data.options.filter((o: any) => o.id !== optId);
    updateNodeData({ options: opts });
    setEdges((eds) => eds.filter((e) => e.sourceHandle !== optId));
  };

  const addReportFormat = () => {
    const formats = data.reportFormats || [];
    updateNodeData({ 
      reportFormats: [...formats, { 
        id: `fmt_${Date.now()}`, condition: 'Equals', value: '', bgColor: '#fee2e2', textColor: '#ef4444', isBold: true, points: 0 
      }] 
    });
  };

  const updateReportFormat = (fmtId: string, field: string, val: any) => {
    const formats = data.reportFormats.map((f: any) => f.id === fmtId ? { ...f, [field]: val } : f);
    updateNodeData({ reportFormats: formats });
  };

  const removeReportFormat = (fmtId: string) => {
    const formats = data.reportFormats.filter((f: any) => f.id !== fmtId);
    updateNodeData({ reportFormats: formats });
  };

  return (
    <div className="w-[380px] bg-white rounded-2xl shadow-xl border border-slate-200 overflow-visible group flex flex-col font-sans" onClick={e => e.stopPropagation()}>
      
      {/* Header */}
      <div className="bg-[#F8FAFC] border-b border-slate-200 p-3 flex justify-between items-center cursor-move rounded-t-2xl">
        <div className="flex items-center gap-2 text-slate-700 font-bold text-[13px] tracking-tight">
          {getIcon(data.type)}
          <span>{data.type}</span>
        </div>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={onDuplicate} className="p-1.5 text-slate-400 hover:text-primary hover:bg-blue-50 rounded transition-colors nodrag">
            <Copy className="w-3.5 h-3.5" />
          </button>
          <button onClick={onDelete} className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors nodrag">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="p-5 space-y-5 nopan">
        
        {/* Question Title */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Question Label</label>
          <textarea 
            className="w-full text-[14px] border border-slate-200 rounded-lg p-2.5 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none bg-slate-50 hover:bg-white transition-colors nodrag text-slate-800 font-medium resize-none min-h-[60px]"
            value={localLabel}
            onChange={(e) => setLocalLabel(e.target.value)}
            onBlur={() => updateNodeData({ label: localLabel })}
            placeholder="Type your question..."
          />
        </div>

        {/* Type-Specific Options */}
        {(data.type === 'Image Attach' || data.type === 'Video Attach') && (
          <div className="space-y-1.5">
             <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Max File Size (MB)</label>
             <DebouncedInput 
                type="number"
                className="w-full border border-slate-200 rounded-md text-[13px] p-2 bg-slate-50 nodrag font-medium text-slate-700 focus:border-primary focus:outline-none"
                placeholder="e.g. 10"
                value={data.maxSize || 5}
                onChange={(val: number) => updateNodeData({ maxSize: val })}
             />
          </div>
        )}

        {(data.type === 'Dropdown' || data.type === 'Multiple Option') && (
          <div className="space-y-2.5 bg-blue-50/50 p-3 rounded-lg border border-blue-100/50">
            <label className="text-[11px] font-bold text-blue-600 uppercase tracking-wider">Choice Options & Routing</label>
            {(data.options || []).map((opt: any) => (
              <div key={opt.id} className="relative flex items-center bg-white border border-slate-200 rounded-md p-1 pl-2 shadow-sm">
                <DebouncedInput 
                  type="text"
                  className="flex-1 text-[13px] bg-transparent focus:outline-none nodrag text-slate-700 font-medium"
                  value={opt.label}
                  onChange={(val: string) => updateOption(opt.id, val)}
                  placeholder="Option text..."
                />
                <button onClick={() => removeOption(opt.id)} className="p-1.5 text-slate-300 hover:text-red-500 nodrag">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
            <button onClick={addOption} className="w-full py-2 text-[12px] font-bold text-blue-600 hover:bg-blue-100 rounded-md transition-colors flex items-center justify-center gap-1.5 nodrag border border-dashed border-blue-200 mt-2">
              <Plus className="w-3.5 h-3.5" /> Add Choice Option
            </button>
          </div>
        )}

        {/* Universal Excel-style Conditional Formatting / Report Logic */}
        <div className="space-y-3 pt-4 border-t border-slate-100">
          <div className="flex items-center gap-2 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            <PaintBucket className="w-3.5 h-3.5 text-slate-400" />
            Conditional Formatting (Reports)
          </div>
          
          <div className="space-y-2">
            {(data.reportFormats || []).map((fmt: any) => (
              <div key={fmt.id} className="bg-slate-50 border border-slate-200 rounded-lg p-2.5 relative group/fmt shadow-sm flex flex-col gap-2.5">
                
                {/* Logic Row */}
                <div className="flex items-center gap-2 w-full">
                  <span className="text-[12px] font-bold text-slate-500 shrink-0 w-12">If</span>
                  <select 
                    className="flex-1 border border-slate-200 rounded-md text-[12px] p-1.5 bg-white nodrag font-medium text-slate-700 focus:border-primary focus:outline-none"
                    value={fmt.condition}
                    onChange={(e) => updateReportFormat(fmt.id, 'condition', e.target.value)}
                  >
                    <option value="Equals">Equals (=)</option>
                    <option value="Not Equals">Not Equals (≠)</option>
                    <option value="Contains">Contains Text</option>
                    <option value="Greater Than">Greater Than (&gt;)</option>
                    <option value="Less Than">Less Than (&lt;)</option>
                    <option value="Is Empty">Is Blank (Unanswered)</option>
                  </select>
                  
                  {fmt.condition !== 'Is Empty' && (
                    (data.type === 'Dropdown' || data.type === 'Multiple Option') ? (
                      <select
                        className="w-1/3 border border-slate-200 rounded-md text-[12px] p-1.5 bg-white nodrag font-medium text-slate-700 focus:border-primary focus:outline-none"
                        value={fmt.value || ''}
                        onChange={(e) => updateReportFormat(fmt.id, 'value', e.target.value)}
                      >
                        <option value="" disabled>Value...</option>
                        <option value="[Blank]">[Blank] (Unanswered)</option>
                        {(data.options || []).map((opt: any) => (
                          <option key={opt.id} value={opt.label}>{opt.label}</option>
                        ))}
                      </select>
                    ) : (
                      <DebouncedInput 
                        type={data.type === 'Number' ? "number" : "text"}
                        className="w-1/3 border border-slate-200 rounded-md text-[12px] p-1.5 bg-white nodrag font-medium text-slate-700 focus:border-primary focus:outline-none"
                        placeholder="Value..."
                        value={fmt.value}
                        onChange={(val: any) => updateReportFormat(fmt.id, 'value', val)}
                      />
                    )
                  )}
                </div>

                {/* Styling & Points Row */}
                <div className="flex items-center justify-between w-full pt-2 border-t border-slate-200">
                  <div className="flex items-center gap-2">
                    <ColorPicker 
                      color={fmt.bgColor} 
                      onChange={(c: string) => updateReportFormat(fmt.id, 'bgColor', c)} 
                      label="Background Color"
                      icon={PaintBucket}
                    />
                    <ColorPicker 
                      color={fmt.textColor} 
                      onChange={(c: string) => updateReportFormat(fmt.id, 'textColor', c)} 
                      label="Text Color"
                      icon={TypeIcon}
                    />
                    <button 
                      onClick={() => updateReportFormat(fmt.id, 'isBold', !fmt.isBold)}
                      className={`p-1.5 border rounded-md transition-colors nodrag ${fmt.isBold ? 'bg-slate-200 border-slate-300' : 'bg-white border-slate-200 hover:bg-slate-50'}`}
                      title="Bold"
                    >
                      <Bold className="w-3.5 h-3.5 text-slate-600" />
                    </button>
                    
                    {/* Preview Box */}
                    <div 
                      className="ml-2 px-2 py-0.5 rounded text-[11px] border border-slate-200 flex items-center justify-center"
                      style={{ backgroundColor: fmt.bgColor, color: fmt.textColor, fontWeight: fmt.isBold ? 'bold' : 'normal' }}
                    >
                      Aa
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] font-bold text-slate-500">Pts</span>
                    <DebouncedInput 
                      type="number"
                      className="w-12 border border-slate-200 rounded-md text-[12px] p-1 bg-white nodrag font-bold text-slate-700 text-center focus:border-primary focus:outline-none"
                      value={fmt.points || 0}
                      onChange={(val: number) => updateReportFormat(fmt.id, 'points', val)}
                    />
                  </div>
                </div>

                <button 
                  onClick={() => removeReportFormat(fmt.id)} 
                  className="absolute -right-2 -top-2 bg-white border border-slate-200 p-1 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-full shadow-sm nodrag opacity-0 group-hover/fmt:opacity-100 transition-opacity"
                >
                  <Trash2 className="w-3.5 h-3.5"/>
                </button>
              </div>
            ))}
            <button onClick={addReportFormat} className="w-full py-2 text-[12px] font-bold text-slate-500 hover:bg-slate-50 rounded-md transition-colors flex items-center justify-center gap-1.5 nodrag border border-dashed border-slate-300">
              <Plus className="w-3.5 h-3.5" /> Add Condition & Formatting
            </button>
          </div>
        </div>

        {/* Question Frequency */}
        <div className="pt-4 border-t border-slate-100 space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Question Frequency</label>
            <div className="flex items-center gap-1.5 nodrag">
              <span className="text-[10px] font-bold text-slate-400">Use Global</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" className="sr-only peer" 
                  checked={data.useGlobalSchedule !== false}
                  onChange={(e) => updateNodeData({ useGlobalSchedule: e.target.checked })}
                />
                <div className="w-6 h-3.5 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-2.5 after:w-2.5 after:transition-all peer-checked:bg-blue-500"></div>
              </label>
            </div>
          </div>

          {/* Frequency Selector */}
          <select 
            className="w-full border border-slate-200 rounded-md text-[12px] p-2 bg-slate-50 hover:bg-white nodrag font-bold text-slate-700 focus:border-primary focus:outline-none transition-colors"
            value={data.frequency || 'Daily'}
            onChange={(e) => updateNodeData({ frequency: e.target.value, validUntilNext: false })}
          >
            <option value="Daily">Daily</option>
            <option value="Weekly">Weekly</option>
            <option value="Monthly">Monthly</option>
          </select>

          {/* Valid Until Next Occurrence — only for Weekly / Monthly */}
          {(data.frequency === 'Weekly' || data.frequency === 'Monthly') && (
            <label className="flex items-start gap-2 cursor-pointer nodrag group">
              <input 
                type="checkbox" 
                className="mt-0.5 w-3.5 h-3.5 accent-blue-500 nodrag"
                checked={data.validUntilNext === true}
                onChange={(e) => updateNodeData({ validUntilNext: e.target.checked })}
              />
              <div>
                <span className="text-[11px] font-bold text-slate-600 group-hover:text-blue-600 transition-colors">Valid until next occurrence</span>
                <p className="text-[9px] text-slate-400 leading-tight mt-0.5">If checked, this question stays fillable until the next schedule is generated</p>
              </div>
            </label>
          )}

          {/* Custom Override Panel */}
          {data.useGlobalSchedule === false && (
            <div className="p-2.5 bg-blue-50/40 rounded-lg border border-blue-100 space-y-2 nodrag">
              <p className="text-[9px] font-bold text-blue-500 uppercase tracking-wider">Custom Schedule Override</p>

              {data.frequency === 'Daily' && (
                <div>
                  <label className="text-[9px] font-bold text-slate-500 block mb-1.5">Exception Days (Skip)</label>
                  <div className="flex flex-wrap gap-1">
                    {['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'].map(day => {
                      const sel = (data.customDailyExceptions || []).includes(day);
                      return (
                        <button key={day} onClick={() => {
                          const prev = data.customDailyExceptions || [];
                          updateNodeData({ customDailyExceptions: sel ? prev.filter((d:string) => d !== day) : [...prev, day] });
                        }} className={`px-1.5 py-1 text-[9px] font-bold rounded border transition-all ${sel ? 'bg-red-50 border-red-200 text-red-600' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'}`}>
                          {day.substring(0,3)}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {data.frequency === 'Weekly' && (
                <div>
                  <label className="text-[9px] font-bold text-slate-500 block mb-1.5">Occurrence Days</label>
                  <div className="flex flex-wrap gap-1">
                    {['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'].map(day => {
                      const sel = (data.customWeeklyOccurrences || []).includes(day);
                      return (
                        <button key={day} onClick={() => {
                          const prev = data.customWeeklyOccurrences || [];
                          updateNodeData({ customWeeklyOccurrences: sel ? prev.filter((d:string) => d !== day) : [...prev, day] });
                        }} className={`px-1.5 py-1 text-[9px] font-bold rounded border transition-all ${sel ? 'bg-blue-50 border-blue-200 text-blue-600' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'}`}>
                          {day.substring(0,3)}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {data.frequency === 'Monthly' && (
                <div className="space-y-2">
                  <select 
                    className="w-full p-1.5 border border-slate-200 rounded text-[10px] text-slate-700 font-medium focus:outline-none"
                    value={data.customMonthlyType || 'Date'}
                    onChange={(e) => updateNodeData({ customMonthlyType: e.target.value })}
                  >
                    <option value="Date">On Date(s)</option>
                    <option value="Interval">Every X Days</option>
                  </select>

                  {(data.customMonthlyType === 'Date' || !data.customMonthlyType) && (
                    <div>
                      <p className="text-[9px] text-slate-400 mb-1">Select one or more dates</p>
                      <div className="grid grid-cols-7 gap-0.5">
                        {Array.from({length: 31}, (_, i) => i+1).map(d => {
                          const sel = (data.customMonthlyDates || []).includes(d);
                          return (
                            <button key={d} onClick={() => {
                              const prev = data.customMonthlyDates || [];
                              updateNodeData({ customMonthlyDates: sel ? prev.filter((x:number) => x !== d) : [...prev, d].sort((a:number,b:number)=>a-b) });
                            }} className={`py-0.5 text-[9px] font-bold rounded border transition-all ${sel ? 'bg-blue-500 border-blue-500 text-white' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'}`}>
                              {d}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {data.customMonthlyType === 'Interval' && (
                    <div className="space-y-1">
                      {(data.customMonthlyIntervals || [7]).map((val: number, i: number) => (
                        <div key={i} className="flex items-center gap-1.5">
                          <span className="text-[9px] text-slate-400 shrink-0">Every</span>
                          <input type="number" min="1" max="365"
                            className="w-12 p-1 border border-slate-200 rounded text-[10px] text-slate-700 font-medium focus:outline-none"
                            value={val}
                            onChange={(e) => {
                              const arr = [...(data.customMonthlyIntervals || [7])];
                              arr[i] = Number(e.target.value);
                              updateNodeData({ customMonthlyIntervals: arr });
                            }}
                          />
                          <span className="text-[9px] text-slate-400 flex-1">days</span>
                          {(data.customMonthlyIntervals || []).length > 1 && (
                            <button onClick={() => {
                              const arr = (data.customMonthlyIntervals || []).filter((_:any, idx:number) => idx !== i);
                              updateNodeData({ customMonthlyIntervals: arr });
                            }} className="text-red-400 hover:text-red-600 text-[10px] font-bold">✕</button>
                          )}
                        </div>
                      ))}
                      <button onClick={() => updateNodeData({ customMonthlyIntervals: [...(data.customMonthlyIntervals || [7]), 7] })} className="text-[10px] font-bold text-blue-500 hover:text-blue-700 flex items-center gap-1">
                        + Add Interval
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Compulsory Toggle */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
           <span className="text-[12px] font-bold text-slate-700">Required Question?</span>
           <label className="relative inline-flex items-center cursor-pointer nodrag">
            <input 
              type="checkbox" 
              className="sr-only peer" 
              checked={data.required || false}
              onChange={(e) => updateNodeData({ required: e.target.checked })}
            />
            <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
          </label>
        </div>
      </div>
    </div>
  );
}
