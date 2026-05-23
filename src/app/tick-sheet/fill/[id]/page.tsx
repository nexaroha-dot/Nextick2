"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Info, Search, CheckCircle2, Circle, X, CheckSquare, ChevronDown, Award } from 'lucide-react';
import Link from 'next/link';

// Mock Questions for the fill interface
const mockQuestions = [
  { 
    id: 'q1', 
    type: 'Short Text', 
    title: 'Machine ID Number', 
    description: 'Enter the unique ID of the machine located on the front metallic panel. It usually starts with "MAC-".', 
    maxMarks: null 
  },
  { 
    id: 'q2', 
    type: 'Dropdown', 
    title: 'Operational Status', 
    description: 'Select the current status of the machine. If stopped, please log an issue in the next step.', 
    options: ['Running', 'Stopped', 'Maintenance Required'], 
    maxMarks: 10 
  },
  { 
    id: 'q3', 
    type: 'Number', 
    title: 'Temperature Reading', 
    description: 'Enter the temperature reading from the main digital gauge in Celsius.', 
    maxMarks: 5 
  },
  { 
    id: 'q4', 
    type: 'Multiple Option', 
    title: 'Safety Checks Passed', 
    description: 'Physically inspect and check all the safety systems that passed the morning check.', 
    options: ['Guards in place', 'Emergency stop working', 'No leaks detected'], 
    maxMarks: 15 
  },
  { 
    id: 'q5', 
    type: 'Long Text', 
    title: 'Additional Notes', 
    description: 'Provide any additional context or notes regarding this checklist execution.', 
    maxMarks: null 
  },
];

export default function TickSheetFillPage() {
  const params = useParams();
  const router = useRouter();
  
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [showDescModal, setShowDescModal] = useState<string | null>(null);
  
  // Global Settings States
  const [showPointsInQuestionnaire, setShowPointsInQuestionnaire] = useState(false);
  const [showPointsInTicksheet, setShowPointsInTicksheet] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('nextick_global_settings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.showPointsInQuestionnaire !== undefined) setShowPointsInQuestionnaire(parsed.showPointsInQuestionnaire);
        if (parsed.showPointsInTicksheet !== undefined) setShowPointsInTicksheet(parsed.showPointsInTicksheet);
      } catch (e) {}
    }
  }, []);

  const handleAnswerChange = (qId: string, value: any) => {
    setAnswers(prev => ({ ...prev, [qId]: value }));
  };

  const handleMultipleOptionChange = (qId: string, option: string, checked: boolean) => {
    setAnswers(prev => {
      const current = Array.isArray(prev[qId]) ? prev[qId] : [];
      if (checked) {
        return { ...prev, [qId]: [...current, option] };
      } else {
        return { ...prev, [qId]: current.filter((o: string) => o !== option) };
      }
    });
  };

  // Helper to check if a question is fully answered
  const isAnswered = (qId: string) => {
    const val = answers[qId];
    if (Array.isArray(val)) return val.length > 0;
    return val !== undefined && val !== null && val !== '';
  };

  const filteredQuestions = mockQuestions.filter(q => 
    q.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalQuestions = mockQuestions.length;
  const answeredCount = mockQuestions.filter(q => isAnswered(q.id)).length;
  const progressPercent = Math.round((answeredCount / totalQuestions) * 100) || 0;

  const scrollToQuestion = (id: string) => {
    const el = document.getElementById(`question-${id}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      // Add a brief highlight flash
      el.classList.add('ring-2', 'ring-blue-500', 'ring-offset-2');
      setTimeout(() => el.classList.remove('ring-2', 'ring-blue-500', 'ring-offset-2'), 1500);
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-slate-50/50 dark:bg-[#0B1120] font-sans overflow-y-auto overflow-x-hidden">
      
      {/* MAIN CONTENT AREA */}
      <div className="max-w-3xl mx-auto p-4 sm:p-6 md:p-10 pb-32 pt-6 md:pt-10">
        <div className="mb-6 md:mb-8 relative z-10">
          <Link href="/tick-sheet" className="inline-flex items-center gap-2 text-xs md:text-sm font-bold text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors mb-4 md:mb-4">
            <ArrowLeft className="w-4 h-4" /> Back to Ticksheets
          </Link>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">Daily Machine Checklist</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1.5 md:mt-2 font-medium">Please answer all the required questions below.</p>

          {/* Mobile Search Box */}
          <div className="md:hidden mt-5 relative pointer-events-auto">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search questions..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-10 pr-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-slate-700 dark:text-slate-200 shadow-sm"
            />
          </div>
        </div>

        <div className="space-y-5 md:space-y-6 relative z-10">
          {filteredQuestions.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700">
              <p className="text-slate-500 dark:text-slate-400 font-medium">No questions found matching your search.</p>
            </div>
          ) : (
            filteredQuestions.map((q, index) => (
              <div 
                key={q.id} 
                id={`question-${q.id}`}
                className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 md:p-6 shadow-sm transition-all duration-500 relative overflow-hidden"
              >
                {/* Green left border indicator if answered */}
                <div className={`absolute left-0 top-0 bottom-0 w-1.5 transition-colors duration-300 ${isAnswered(q.id) ? 'bg-green-500' : 'bg-transparent'}`}></div>

                <div className="flex flex-col md:flex-row items-start justify-between mb-4 gap-3 md:gap-0">
                  <div className="flex items-start gap-2.5 max-w-full md:max-w-[80%] w-full">
                    <span className="text-slate-400 font-bold text-sm md:text-sm mt-0.5">{index + 1}.</span>
                    <h3 className="text-base md:text-lg font-bold text-slate-800 dark:text-slate-100 leading-tight flex-1">
                      {q.title}
                    </h3>
                    
                    {/* Info Icon with Tooltip */}
                    <div className="relative group/tooltip flex items-center -mt-1 md:mt-0">
                      <button 
                        onClick={() => setShowDescModal(q.id)}
                        className="text-slate-400 hover:text-blue-500 transition-colors w-8 h-8 flex items-center justify-center -mr-2 md:mr-0 rounded-full active:bg-slate-100 dark:active:bg-slate-700"
                      >
                        <Info className="w-5 h-5 md:w-4 md:h-4" />
                      </button>
                      {/* Tooltip */}
                      <div className="hidden md:block absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-64 p-2 bg-slate-800 dark:bg-slate-700 text-white text-xs rounded-lg opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all z-10 text-center shadow-xl pointer-events-none">
                        {q.description}
                        <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-slate-800 dark:border-t-slate-700"></div>
                      </div>
                    </div>
                  </div>

                  {/* Max Points Display */}
                  {showPointsInQuestionnaire && q.maxMarks && (
                    <div className="self-start md:self-auto bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap border border-blue-100 dark:border-blue-800/50">
                      Points up to {q.maxMarks}
                    </div>
                  )}
                </div>

                {/* Input Rendering based on type */}
                <div className="mt-4 pl-0 md:pl-6">
                  {q.type === 'Short Text' && (
                    <input 
                      type="text" 
                      value={answers[q.id] || ''}
                      onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                      className="w-full border border-slate-200 dark:border-slate-600 rounded-xl p-3.5 md:p-3 bg-slate-50 dark:bg-slate-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm md:text-base font-medium text-slate-700 dark:text-slate-200"
                      placeholder="Type your answer here..."
                    />
                  )}

                  {q.type === 'Long Text' && (
                    <textarea 
                      value={answers[q.id] || ''}
                      onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                      className="w-full border border-slate-200 dark:border-slate-600 rounded-xl p-3.5 md:p-3 bg-slate-50 dark:bg-slate-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm md:text-base font-medium text-slate-700 dark:text-slate-200 min-h-[120px] md:min-h-[100px] resize-y"
                      placeholder="Type your detailed answer here..."
                    />
                  )}

                  {q.type === 'Number' && (
                    <input 
                      type="number" 
                      value={answers[q.id] || ''}
                      onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                      className="w-full md:max-w-xs border border-slate-200 dark:border-slate-600 rounded-xl p-3.5 md:p-3 bg-slate-50 dark:bg-slate-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm md:text-base font-bold text-slate-700 dark:text-slate-200"
                      placeholder="e.g. 42"
                    />
                  )}

                  {q.type === 'Dropdown' && (
                    <div className="relative w-full md:max-w-sm">
                      <select 
                        value={answers[q.id] || ''}
                        onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                        className="w-full border border-slate-200 dark:border-slate-600 rounded-xl p-3.5 md:p-3 pr-10 bg-slate-50 dark:bg-slate-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm md:text-base font-medium text-slate-700 dark:text-slate-200 appearance-none cursor-pointer"
                      >
                        <option value="" disabled>Select an option...</option>
                        {q.options?.map(opt => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                    </div>
                  )}

                  {q.type === 'Multiple Option' && (
                    <div className="space-y-3">
                      {q.options?.map(opt => {
                        const isChecked = (answers[q.id] || []).includes(opt);
                        return (
                          <label key={opt} className={`flex items-start md:items-center gap-3.5 p-3.5 md:p-3 rounded-xl border transition-all cursor-pointer ${isChecked ? 'bg-blue-50 border-blue-500 dark:bg-blue-900/20 dark:border-blue-500' : 'bg-slate-50 border-slate-200 hover:border-blue-300 dark:bg-slate-900 dark:border-slate-700 dark:hover:border-slate-500'}`}>
                            <div className={`w-5 h-5 mt-0.5 md:mt-0 rounded flex items-center justify-center border shrink-0 transition-colors ${isChecked ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-300 bg-white dark:border-slate-600 dark:bg-slate-800'}`}>
                              {isChecked && <CheckSquare className="w-3.5 h-3.5" />}
                            </div>
                            <span className={`text-sm md:text-base font-medium flex-1 ${isChecked ? 'text-blue-700 dark:text-blue-300' : 'text-slate-700 dark:text-slate-300'}`}>{opt}</span>
                            <input 
                              type="checkbox" 
                              className="hidden"
                              checked={isChecked}
                              onChange={(e) => handleMultipleOptionChange(q.id, opt, e.target.checked)}
                            />
                          </label>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Earned Points Display */}
                {showPointsInTicksheet && q.maxMarks && isAnswered(q.id) && (
                  <div className="mt-5 pl-0 md:pl-6 animate-in slide-in-from-top-2 fade-in duration-300">
                    <div className="inline-flex items-center gap-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 px-3 py-2 rounded-lg text-xs font-bold">
                      <Award className="w-4 h-4" />
                      You earned {q.maxMarks} points
                    </div>
                  </div>
                )}

              </div>
            ))
          )}
        </div>
        <div className="mt-8 md:mt-10 flex justify-end relative z-10">
           <button className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8 py-3.5 md:py-3 rounded-xl font-bold shadow-lg shadow-blue-600/20 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed">
             Submit Ticksheet
           </button>
        </div>

      </div>

      {/* RIGHT FLOATING UI (Search & Strip) */}
      <div className="fixed md:top-8 md:bottom-8 right-2 md:right-8 top-1/2 -translate-y-1/2 md:translate-y-0 h-[60vh] md:h-auto flex flex-col items-end pointer-events-none z-50">
        
        {/* Floating Search Box - Desktop Only */}
        <div className="hidden md:block pointer-events-auto w-64 mb-6 shadow-lg rounded-xl overflow-hidden bg-white/80 backdrop-blur-md dark:bg-slate-800/80 border border-slate-200/50 dark:border-slate-700/50">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search questions..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent pl-9 pr-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-slate-700 dark:text-slate-200"
            />
          </div>
        </div>

        {/* Floating Single Line Patti (Timeline Strip) */}
        <div className="pointer-events-auto flex-1 w-1.5 md:w-2.5 rounded-full flex flex-col overflow-hidden shadow-sm md:shadow-md border border-slate-200/30 md:border-slate-200/50 dark:border-slate-700/50 bg-white dark:bg-slate-800">
          {mockQuestions.map((q) => {
            const answered = isAnswered(q.id);
            return (
              <div 
                key={q.id}
                title={q.title}
                onClick={() => scrollToQuestion(q.id)}
                className={`flex-1 w-full transition-colors duration-500 cursor-pointer hover:brightness-110 ${answered ? 'bg-green-500' : 'bg-red-500'}`}
              ></div>
            );
          })}
        </div>
      </div>

      {/* MODAL: Description Pop-up */}
      {showDescModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200 pointer-events-auto">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/80">
              <h3 className="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <Info className="w-5 h-5 text-blue-500" /> Question Details
              </h3>
              <button 
                onClick={() => setShowDescModal(null)}
                className="w-8 h-8 flex items-center justify-center text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-800 dark:hover:text-slate-100 rounded-full transition-colors active:scale-95"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <p className="text-sm md:text-base font-medium text-slate-600 dark:text-slate-300 leading-relaxed">
                {mockQuestions.find(q => q.id === showDescModal)?.description}
              </p>
            </div>
            <div className="p-5 border-t border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/80 flex justify-end">
              <button 
                onClick={() => setShowDescModal(null)}
                className="w-full md:w-auto px-6 py-3 md:py-2.5 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-100 rounded-xl text-sm font-bold transition-colors active:scale-95"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
