import React, { useState, useEffect } from 'react';
import { useReactFlow } from '@xyflow/react';
import { Copy, Trash2, Plus, Hash, Type, FileText, Image as ImageIcon, Video, CheckSquare, ChevronDown, PaintBucket, Bold, Type as TypeIcon, Calendar, CalendarClock, Clock, ChevronUp, Sliders, BarChart2, RotateCcw } from 'lucide-react';

const COLORS = [
  '#ef4444', '#f97316', '#f59e0b', '#eab308', '#84cc16', '#22c55e', '#10b981',
  '#14b8a6', '#06b6d4', '#0ea5e9', '#3b82f6', '#6366f1', '#8b5cf6', '#a855f7',
  '#d946ef', '#ec4899', '#f43f5e', '#ffffff', '#e2e8f0', '#94a3b8', '#475569', '#0f172a'
];

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

function ColorPicker({ color, onChange, label, icon: Icon }: any) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="relative">
      <button onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 p-1.5 border border-slate-200 rounded-md bg-white hover:bg-slate-50 transition-colors nodrag" title={label}>
        <Icon className="w-3 h-3 text-slate-400" />
        <div className="w-3.5 h-3.5 rounded-sm border border-slate-200" style={{ backgroundColor: color || '#ffffff' }} />
      </button>
      {isOpen && (
        <div className="absolute top-full left-0 mt-1 p-2 bg-white border border-slate-200 rounded-lg shadow-xl grid grid-cols-6 gap-1 z-50 w-[152px]">
          {COLORS.map(c => (
            <div key={c} onClick={() => { onChange(c); setIsOpen(false); }}
              className="w-5 h-5 rounded cursor-pointer border border-slate-200 hover:scale-110 transition-transform"
              style={{ backgroundColor: c }} />
          ))}
        </div>
      )}
    </div>
  );
}

function DebouncedInput({ value, onChange, className, placeholder, type = 'text' }: any) {
  const [localVal, setLocalVal] = useState(value);
  useEffect(() => { setLocalVal(value); }, [value]);
  return (
    <input type={type} className={className} placeholder={placeholder} value={localVal}
      onChange={(e) => setLocalVal(e.target.value)}
      onBlur={() => onChange(type === 'number' ? Number(localVal) : localVal)} />
  );
}

function SectionHeader({ icon: Icon, title, count, open, onToggle, accentColor = 'blue' }: any) {
  const colors: any = {
    blue: 'text-blue-600 bg-blue-50',
    purple: 'text-purple-600 bg-purple-50',
    amber: 'text-amber-600 bg-amber-50',
    green: 'text-green-600 bg-green-50',
  };
  return (
    <button onClick={onToggle}
      className="w-full flex items-center gap-2 py-2 px-3 rounded-lg hover:bg-slate-50 transition-colors group nodrag text-left">
      <div className={`w-6 h-6 rounded-md flex items-center justify-center ${colors[accentColor]}`}>
        <Icon className="w-3.5 h-3.5" />
      </div>
      <span className="flex-1 text-[12px] font-bold text-slate-700">{title}</span>
      {count !== undefined && count > 0 && (
        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${colors[accentColor]}`}>{count}</span>
      )}
      {open ? <ChevronUp className="w-3.5 h-3.5 text-slate-400" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-400" />}
    </button>
  );
}

export default function QuestionNode({ id, data, isConnectable, index }: any) {
  const { setNodes, setEdges } = useReactFlow();
  const [localLabel, setLocalLabel] = useState(data.label || '');
  const [localDescription, setLocalDescription] = useState(data.description || '');
  const [openSections, setOpenSections] = useState({ options: true, format: false, schedule: false, settings: false, description: false });

  useEffect(() => { 
    setLocalLabel(data.label || ''); 
    setLocalDescription(data.description || '');
  }, [data.label, data.description]);

  const toggle = (s: string) => setOpenSections(p => ({ ...p, [s]: !p[s as keyof typeof p] }));

  const updateNodeData = (newData: any) => {
    setNodes(nds => nds.map(node => node.id === id ? { ...node, data: { ...node.data, ...newData } } : node));
  };

  const onDelete = () => {
    setNodes(nodes => nodes.filter(n => n.id !== id));
    setEdges(edges => edges.filter(e => e.source !== id && e.target !== id));
  };

  const onDuplicate = () => {
    setNodes(nodes => {
      const node = nodes.find(n => n.id === id);
      if (!node) return nodes;
      return [...nodes, { ...node, id: `${id}-copy-${Date.now()}`, position: { x: node.position.x + 40, y: node.position.y + 40 }, data: { ...node.data, label: `${node.data.label} (Copy)`, description: node.data.description } }];
    });
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'Number': return <Hash className="w-3.5 h-3.5" />;
      case 'Dropdown': return <ChevronDown className="w-3.5 h-3.5" />;
      case 'Multiple Option': return <CheckSquare className="w-3.5 h-3.5" />;
      case 'Image Attach': return <ImageIcon className="w-3.5 h-3.5" />;
      case 'Video Attach': return <Video className="w-3.5 h-3.5" />;
      case 'Long Text': return <FileText className="w-3.5 h-3.5" />;
      case 'Date': return <Calendar className="w-3.5 h-3.5" />;
      case 'Date & Time': return <CalendarClock className="w-3.5 h-3.5" />;
      case 'Time': return <Clock className="w-3.5 h-3.5" />;
      case 'Location': return <Hash className="w-3.5 h-3.5" />; // Re-using Hash since MapPin isn't imported here, or I can import MapPin
      default: return <Type className="w-3.5 h-3.5" />;
    }
  };

  const addOption = () => {
    const opts = data.options || [];
    updateNodeData({ options: [...opts, { id: `opt_${Date.now()}`, label: `Option ${opts.length + 1}` }] });
  };
  const updateOption = (optId: string, val: string) => updateNodeData({ options: data.options.map((o: any) => o.id === optId ? { ...o, label: val } : o) });
  const removeOption = (optId: string) => {
    updateNodeData({ options: data.options.filter((o: any) => o.id !== optId) });
    setEdges(eds => eds.filter(e => e.sourceHandle !== optId));
  };

  const addReportFormat = () => {
    const formats = data.reportFormats || [];
    updateNodeData({ reportFormats: [...formats, { id: `fmt_${Date.now()}`, condition: 'Equals', value: '', bgColor: '#fee2e2', textColor: '#ef4444', isBold: true, points: 0 }] });
  };
  const updateReportFormat = (fmtId: string, field: string, val: any) => updateNodeData({ reportFormats: data.reportFormats.map((f: any) => f.id === fmtId ? { ...f, [field]: val } : f) });
  const removeReportFormat = (fmtId: string) => updateNodeData({ reportFormats: data.reportFormats.filter((f: any) => f.id !== fmtId) });

  const hasOptions = data.type === 'Dropdown' || data.type === 'Multiple Option';
  const hasPoints = (data.reportFormats || []).some((f: any) => f.points && Number(f.points) !== 0);
  const isMissingMaxMarks = hasPoints && !data.maxMarks;
  const fmtCount = (data.reportFormats || []).length;
  const freq = data.frequency || 'Daily';
  const freqColors: any = { Daily: 'bg-green-500', Weekly: 'bg-blue-500', Monthly: 'bg-purple-500' };

  return (
    <div className={`w-[360px] max-w-full bg-white rounded-2xl shadow-lg border border-slate-200 overflow-visible group flex flex-col font-sans ${!isConnectable ? 'w-full' : ''}`} onClick={e => e.stopPropagation()}>

      {/* ── HEADER ── */}
      <div className="bg-[#F8FAFC] border-b border-slate-200 px-3 py-2.5 flex items-center gap-2 cursor-move rounded-t-2xl">
        <div className="flex items-center gap-2 flex-1 min-w-0 nodrag">
          {index !== undefined && (
            <div className="w-5 h-5 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-extrabold text-[10px] shrink-0 shadow-sm border border-white">
              {index + 1}
            </div>
          )}
          
          <div className="relative flex items-center bg-white border border-slate-200 rounded-lg px-2 py-1 shadow-sm hover:border-blue-400 transition-colors cursor-pointer group/select flex-1 max-w-[160px]">
            {getIcon(data.type)}
            <select 
              className="appearance-none bg-transparent border-none focus:outline-none focus:ring-0 cursor-pointer font-bold truncate text-slate-700 w-full pl-1.5 pr-4 text-[11px]"
              value={data.type || 'Short Text'}
              onChange={(e) => updateNodeData({ type: e.target.value })}
            >
              <option value="Short Text">Short Text</option>
              <option value="Long Text">Long Text</option>
              <option value="Number">Number</option>
              <option value="Dropdown">Dropdown</option>
              <option value="Multiple Option">Multiple Option</option>
              <option value="Image Attach">Image Attach</option>
              <option value="Video Attach">Video Attach</option>
              <option value="Date">Date</option>
              <option value="Date & Time">Date & Time</option>
              <option value="Time">Time</option>
              <option value="Location">Location</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-1.5 pointer-events-none group-hover/select:text-blue-500 transition-colors" />
          </div>
        </div>
        {/* Frequency pill */}
        <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold text-white shrink-0 ${freqColors[freq]}`}>
          <span className="w-1 h-1 rounded-full bg-white/60 inline-block"></span>{freq}
        </div>
        <div className="flex gap-0.5 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity shrink-0">
          <button onClick={onDuplicate} className="p-1.5 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors nodrag"><Copy className="w-3.5 h-3.5" /></button>
          <button onClick={onDelete} className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors nodrag"><Trash2 className="w-3.5 h-3.5" /></button>
        </div>
      </div>

      {/* ── BODY ── */}
      <div className="p-3 space-y-1.5 nopan">

        {/* Question Label */}
        <div className="mb-2">
          <textarea
            className="w-full text-[13px] border border-slate-200 rounded-xl p-2.5 focus:border-blue-400 focus:ring-1 focus:ring-blue-100 focus:outline-none bg-slate-50 hover:bg-white transition-colors nodrag text-slate-800 font-bold resize-none min-h-[52px]"
            value={localLabel}
            onChange={(e) => setLocalLabel(e.target.value)}
            onBlur={() => updateNodeData({ label: localLabel })}
            placeholder="Type your question..."
          />
        </div>

        {/* ── SECTION: Options (auto-open for dropdowns) ── */}
        {(hasOptions || data.type === 'Image Attach' || data.type === 'Video Attach') && (
          <div className="border border-slate-100 rounded-xl overflow-hidden">
            <SectionHeader icon={CheckSquare} title={hasOptions ? 'Choices & Routing' : 'File Settings'} count={hasOptions ? (data.options || []).length : undefined} open={openSections.options} onToggle={() => toggle('options')} accentColor="blue" />
            {openSections.options && (
              <div className="px-3 pb-3 space-y-1.5 border-t border-slate-100">
                {data.type === 'Image Attach' || data.type === 'Video Attach' ? (
                  <div className="pt-2">
                    <label className="text-[10px] font-bold text-slate-500 block mb-1">Max File Size (MB)</label>
                    <DebouncedInput type="number"
                      className="w-full border border-slate-200 rounded-lg text-[12px] p-2 bg-slate-50 nodrag font-medium text-slate-700 focus:border-blue-400 focus:outline-none"
                      placeholder="e.g. 10" value={data.maxSize || 5}
                      onChange={(val: number) => updateNodeData({ maxSize: val })} />
                  </div>
                ) : (
                  <>
                    <div className="pt-2 space-y-1.5">
                      {(data.options || []).map((opt: any) => (
                        <div key={opt.id} className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5">
                          <div className="w-1.5 h-1.5 rounded-full bg-blue-300 shrink-0"></div>
                          <DebouncedInput type="text"
                            className="flex-1 text-[12px] bg-transparent focus:outline-none nodrag text-slate-700 font-medium"
                            value={opt.label} onChange={(val: string) => updateOption(opt.id, val)} placeholder="Option text..." />
                          <button onClick={() => removeOption(opt.id)} className="text-slate-300 hover:text-red-400 transition-colors nodrag"><Trash2 className="w-3 h-3" /></button>
                        </div>
                      ))}
                    </div>
                    <button onClick={addOption} className="w-full py-1.5 text-[11px] font-bold text-blue-500 hover:bg-blue-50 rounded-lg border border-dashed border-blue-200 transition-all flex items-center justify-center gap-1.5 nodrag mt-1">
                      <Plus className="w-3 h-3" /> Add Option
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        )}

        {/* ── SECTION: Conditional Formatting ── */}
        <div className="border border-slate-100 rounded-xl overflow-hidden">
          <SectionHeader icon={BarChart2} title="Conditional Formatting" count={fmtCount} open={openSections.format} onToggle={() => toggle('format')} accentColor="purple" />
          {openSections.format && (
            <div className="px-3 pb-3 border-t border-slate-100 space-y-2 pt-2">
              {(data.reportFormats || []).map((fmt: any) => (
                <div key={fmt.id} className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 relative group/fmt space-y-2">
                  {/* Condition Row */}
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-bold text-slate-400 w-4 shrink-0">If</span>
                    <select
                      className="flex-1 border border-slate-200 rounded-lg text-[11px] p-1.5 bg-white nodrag font-medium text-slate-700 focus:border-blue-400 focus:outline-none"
                      value={fmt.condition} onChange={(e) => updateReportFormat(fmt.id, 'condition', e.target.value)}>
                      <option value="Equals">Equals (=)</option>
                      <option value="Not Equals">Not Equals (≠)</option>
                      <option value="Contains">Contains</option>
                      <option value="Greater Than">Greater Than (&gt;)</option>
                      <option value="Less Than">Less Than (&lt;)</option>
                      <option value="Is Empty">Is Blank</option>
                    </select>
                    {fmt.condition !== 'Is Empty' && (
                      hasOptions ? (
                        <select
                          className="w-24 border border-slate-200 rounded-lg text-[11px] p-1.5 bg-white nodrag font-medium text-slate-700 focus:border-blue-400 focus:outline-none"
                          value={fmt.value || ''} onChange={(e) => updateReportFormat(fmt.id, 'value', e.target.value)}>
                          <option value="" disabled>Value</option>
                          <option value="[Blank]">[Blank]</option>
                          {(data.options || []).map((opt: any) => <option key={opt.id} value={opt.label}>{opt.label}</option>)}
                        </select>
                      ) : (
                        <DebouncedInput type={data.type === 'Number' ? 'number' : 'text'}
                          className="w-24 border border-slate-200 rounded-lg text-[11px] p-1.5 bg-white nodrag font-medium text-slate-700 focus:border-blue-400 focus:outline-none"
                          placeholder="Value" value={fmt.value}
                          onChange={(val: any) => updateReportFormat(fmt.id, 'value', val)} />
                      )
                    )}
                  </div>
                  {/* Style + Points Row */}
                  <div className="flex items-center gap-2 pt-1.5 border-t border-slate-200">
                    <div className="flex items-center gap-1">
                      <ColorPicker color={fmt.bgColor} onChange={(c: string) => updateReportFormat(fmt.id, 'bgColor', c)} label="Background" icon={PaintBucket} />
                      <ColorPicker color={fmt.textColor} onChange={(c: string) => updateReportFormat(fmt.id, 'textColor', c)} label="Text Color" icon={TypeIcon} />
                      <button onClick={() => updateReportFormat(fmt.id, 'isBold', !fmt.isBold)}
                        className={`p-1.5 border rounded-md transition-colors nodrag ${fmt.isBold ? 'bg-slate-200 border-slate-300' : 'bg-white border-slate-200 hover:bg-slate-50'}`}>
                        <Bold className="w-3 h-3 text-slate-600" />
                      </button>
                      <div className="ml-1 px-2 py-0.5 rounded-md text-[10px] border border-slate-200"
                        style={{ backgroundColor: fmt.bgColor, color: fmt.textColor, fontWeight: fmt.isBold ? 'bold' : 'normal' }}>Aa</div>
                    </div>
                    <div className="flex items-center gap-1 ml-auto">
                      <span className="text-[10px] font-bold text-slate-400">Pts</span>
                      <DebouncedInput type="number"
                        className="w-12 border border-slate-200 rounded-lg text-[11px] p-1 bg-white nodrag font-bold text-slate-700 text-center focus:border-blue-400 focus:outline-none"
                        value={fmt.points || 0} onChange={(val: number) => updateReportFormat(fmt.id, 'points', val)} />
                    </div>
                  </div>
                  <button onClick={() => removeReportFormat(fmt.id)}
                    className="absolute -right-2 -top-2 bg-white border border-slate-200 p-1 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-full shadow-sm nodrag opacity-0 group-hover/fmt:opacity-100 transition-opacity">
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
              <button onClick={addReportFormat} className="w-full py-1.5 text-[11px] font-bold text-purple-500 hover:bg-purple-50 rounded-lg border border-dashed border-purple-200 transition-all flex items-center justify-center gap-1.5 nodrag">
                <Plus className="w-3 h-3" /> Add Condition
              </button>

              {/* Max Marks — shown only when points exist */}
              {hasPoints && (
                <div className={`mt-2 p-2.5 rounded-xl border ${isMissingMaxMarks ? 'border-amber-300 bg-amber-50' : 'border-green-200 bg-green-50/50'}`}>
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <span className="text-[11px] font-bold text-slate-700">Max Marks (= 100% base)</span>
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ml-auto ${isMissingMaxMarks ? 'bg-amber-200 text-amber-700' : 'bg-green-200 text-green-700'}`}>
                      {isMissingMaxMarks ? '⚠ Required' : '✓ Set'}
                    </span>
                  </div>
                  <input type="number" min="0"
                    className={`w-full border rounded-lg text-[13px] p-2 nodrag font-bold text-slate-700 focus:outline-none transition-all ${isMissingMaxMarks ? 'border-amber-300 bg-white focus:border-amber-500 placeholder-amber-300' : 'border-green-200 bg-white focus:border-green-400'}`}
                    placeholder={isMissingMaxMarks ? 'Enter max marks — required!' : 'e.g. 10'}
                    value={data.maxMarks || ''}
                    onChange={(e) => updateNodeData({ maxMarks: e.target.value === '' ? null : Number(e.target.value) })} />
                  <p className="text-[9px] text-slate-400 mt-1">Scoring above this = &gt;100%. Below = less than 100%.</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── SECTION: Schedule & Settings ── */}
        <div className="border border-slate-100 rounded-xl overflow-hidden">
          <SectionHeader icon={Sliders} title="Schedule & Settings" open={openSections.schedule} onToggle={() => toggle('schedule')} accentColor="amber" />
          {openSections.schedule && (
            <div className="px-3 pb-3 border-t border-slate-100 pt-2 space-y-3">

              {/* Frequency */}
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Frequency</label>
                <div className="flex gap-1">
                  {['Daily', 'Weekly', 'Monthly'].map(f => (
                    <button key={f} onClick={() => updateNodeData({ frequency: f, validUntilNext: false })}
                      className={`flex-1 py-1.5 text-[10px] font-bold rounded-lg border transition-all nodrag ${(data.frequency || 'Daily') === f ? 'bg-blue-500 border-blue-500 text-white shadow-sm' : 'bg-white border-slate-200 text-slate-500 hover:border-blue-300 hover:text-blue-500'}`}>
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              {/* Valid Until Next */}
              {(freq === 'Weekly' || freq === 'Monthly') && (
                <label className="flex items-center gap-2.5 p-2.5 bg-blue-50 rounded-xl border border-blue-100 cursor-pointer nodrag hover:bg-blue-100 transition-colors">
                  <input type="checkbox" className="w-4 h-4 accent-blue-500 nodrag rounded"
                    checked={data.validUntilNext === true}
                    onChange={(e) => updateNodeData({ validUntilNext: e.target.checked })} />
                  <div>
                    <div className="text-[11px] font-bold text-slate-700">Valid until next occurrence</div>
                    <div className="text-[9px] text-slate-400">Stays fillable until next schedule generates</div>
                  </div>
                </label>
              )}

              {/* Use Global / Custom Override */}
              <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                <div>
                  <div className="text-[11px] font-bold text-slate-700">Use Global Schedule</div>
                  <div className="text-[9px] text-slate-400">Follow sidebar rules</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer nodrag">
                  <input type="checkbox" className="sr-only peer"
                    checked={data.useGlobalSchedule !== false}
                    onChange={(e) => updateNodeData({ useGlobalSchedule: e.target.checked })} />
                  <div className="w-8 h-4 bg-slate-300 rounded-full peer peer-checked:after:translate-x-4 peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-blue-500"></div>
                </label>
              </div>

              {/* Custom Override Panel */}
              {data.useGlobalSchedule === false && (
                <div className="p-2.5 bg-blue-50/60 rounded-xl border border-blue-100 space-y-2">
                  <div className="text-[9px] font-bold text-blue-500 uppercase tracking-wider flex items-center gap-1"><RotateCcw className="w-3 h-3" /> Custom Override</div>

                  {freq === 'Daily' && (
                    <div>
                      <label className="text-[9px] font-bold text-slate-500 block mb-1">Skip These Days</label>
                      <div className="flex flex-wrap gap-1">
                        {DAYS.map(day => {
                          const sel = (data.customDailyExceptions || []).includes(day);
                          return (
                            <button key={day} onClick={() => {
                              const prev = data.customDailyExceptions || [];
                              updateNodeData({ customDailyExceptions: sel ? prev.filter((d: string) => d !== day) : [...prev, day] });
                            }} className={`px-1.5 py-1 text-[9px] font-bold rounded-md border transition-all nodrag ${sel ? 'bg-red-500 border-red-500 text-white' : 'bg-white border-slate-200 text-slate-500 hover:border-red-300 hover:text-red-500'}`}>
                              {day.substring(0, 3)}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {freq === 'Weekly' && (
                    <div>
                      <label className="text-[9px] font-bold text-slate-500 block mb-1">Occurrence Days</label>
                      <div className="flex flex-wrap gap-1">
                        {DAYS.map(day => {
                          const sel = (data.customWeeklyOccurrences || []).includes(day);
                          return (
                            <button key={day} onClick={() => {
                              const prev = data.customWeeklyOccurrences || [];
                              updateNodeData({ customWeeklyOccurrences: sel ? prev.filter((d: string) => d !== day) : [...prev, day] });
                            }} className={`px-1.5 py-1 text-[9px] font-bold rounded-md border transition-all nodrag ${sel ? 'bg-blue-500 border-blue-500 text-white' : 'bg-white border-slate-200 text-slate-500 hover:border-blue-300 hover:text-blue-500'}`}>
                              {day.substring(0, 3)}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {freq === 'Monthly' && (
                    <div className="space-y-2">
                      <select className="w-full p-1.5 border border-slate-200 rounded-lg text-[10px] text-slate-700 font-medium focus:outline-none nodrag"
                        value={data.customMonthlyType || 'Date'} onChange={(e) => updateNodeData({ customMonthlyType: e.target.value })}>
                        <option value="Date">On Date(s)</option>
                        <option value="Interval">Every X Days</option>
                      </select>
                      {(data.customMonthlyType === 'Date' || !data.customMonthlyType) && (
                        <div className="grid grid-cols-7 gap-0.5">
                          {Array.from({ length: 31 }, (_, i) => i + 1).map(d => {
                            const sel = (data.customMonthlyDates || []).includes(d);
                            return (
                              <button key={d} onClick={() => {
                                const prev = data.customMonthlyDates || [];
                                updateNodeData({ customMonthlyDates: sel ? prev.filter((x: number) => x !== d) : [...prev, d].sort((a: number, b: number) => a - b) });
                              }} className={`py-0.5 text-[9px] font-bold rounded border transition-all nodrag ${sel ? 'bg-blue-500 border-blue-500 text-white' : 'bg-white border-slate-200 text-slate-400 hover:bg-blue-50'}`}>
                                {d}
                              </button>
                            );
                          })}
                        </div>
                      )}
                      {data.customMonthlyType === 'Interval' && (
                        <div className="space-y-1">
                          {(data.customMonthlyIntervals || [7]).map((val: number, i: number) => (
                            <div key={i} className="flex items-center gap-1.5 bg-white rounded-lg p-1.5 border border-slate-200">
                              <span className="text-[9px] text-slate-400">Every</span>
                              <input type="number" min="1" max="365"
                                className="w-12 p-1 border border-slate-200 rounded text-[10px] text-slate-700 font-bold text-center focus:outline-none nodrag"
                                value={val} onChange={(e) => {
                                  const arr = [...(data.customMonthlyIntervals || [7])];
                                  arr[i] = Number(e.target.value);
                                  updateNodeData({ customMonthlyIntervals: arr });
                                }} />
                              <span className="text-[9px] text-slate-400 flex-1">days</span>
                              {(data.customMonthlyIntervals || []).length > 1 && (
                                <button onClick={() => updateNodeData({ customMonthlyIntervals: (data.customMonthlyIntervals || []).filter((_: any, idx: number) => idx !== i) })}
                                  className="text-red-400 hover:text-red-600 text-[10px] font-bold nodrag">✕</button>
                              )}
                            </div>
                          ))}
                          <button onClick={() => updateNodeData({ customMonthlyIntervals: [...(data.customMonthlyIntervals || [7]), 7] })}
                            className="w-full py-1 text-[10px] font-bold text-blue-500 hover:bg-blue-50 rounded-lg border border-dashed border-blue-200 transition-all nodrag">
                            + Add Interval
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Required + Settings Row */}
              <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                <div>
                  <div className="text-[11px] font-bold text-slate-700">Required Question</div>
                  <div className="text-[9px] text-slate-400">Must be answered</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer nodrag">
                  <input type="checkbox" className="sr-only peer"
                    checked={data.required || false}
                    onChange={(e) => updateNodeData({ required: e.target.checked })} />
                  <div className="w-8 h-4 bg-slate-300 rounded-full peer peer-checked:after:translate-x-4 peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-blue-500"></div>
                </label>
              </div>

            </div>
          )}
        </div>

        {/* ── SECTION: Description & Instructions ── */}
        <div className="border border-slate-100 rounded-xl overflow-hidden">
          <SectionHeader icon={FileText} title="Description & Instructions" open={openSections.description} onToggle={() => toggle('description')} accentColor="green" />
          {openSections.description && (
            <div className="px-3 pb-3 border-t border-slate-100 pt-2">
              <textarea
                className="w-full text-[11px] border border-slate-200/60 rounded-xl p-2.5 focus:border-blue-400 focus:ring-1 focus:ring-blue-100 focus:outline-none bg-slate-50 hover:bg-white transition-colors nodrag text-slate-600 font-medium resize-none min-h-[52px]"
                value={localDescription}
                onChange={(e) => setLocalDescription(e.target.value)}
                onBlur={() => updateNodeData({ description: localDescription })}
                placeholder="Add instruction details or description..."
              />
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
