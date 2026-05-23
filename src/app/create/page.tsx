"use client";

import React, { useState, useEffect } from 'react';
import { Plus, FileText, MoreVertical, FileSignature, Edit, Trash, Copy, Eye } from 'lucide-react';
import Link from 'next/link';

export default function CreateHubPage() {
  const [questionnaires, setQuestionnaires] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  useEffect(() => {
    // Simulated fetch instead of failing on localhost:5000
    const fetchQuestionnaires = async () => {
      try {
        setIsLoading(true);
        // Simulating network delay
        setTimeout(() => {
          setQuestionnaires([
            { _id: '1', title: 'Daily Site Checklist', createdAt: new Date().toISOString() },
            { _id: '2', title: 'Employee Onboarding', createdAt: new Date().toISOString() }
          ]);
          setIsLoading(false);
        }, 800);
      } catch (err) {
        console.error('Failed to fetch questionnaires', err);
        setIsLoading(false);
      }
    };
    fetchQuestionnaires();
  }, []);

  const handleCreateFormClick = () => {
    alert('Upcoming module');
    setDropdownOpen(false);
  };

  const handleDelete = (id: string) => {
    if (!confirm('Are you sure you want to delete this questionnaire?')) return;
    setQuestionnaires(q => q.filter(x => x._id !== id));
    setOpenMenuId(null);
  };

  const handleCopy = (q: any) => {
    const copyData = {
      ...q,
      _id: Date.now().toString(),
      title: `${q.title} (Copy)`,
    };
    setQuestionnaires([copyData, ...questionnaires]);
    setOpenMenuId(null);
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto bg-transparent p-4 md:p-8 font-sans">
      
      {/* Header Area */}
      <div className="pb-6 flex flex-col sm:flex-row sm:items-center justify-between items-start gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Ticksheets & Forms</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">Manage your organization's forms, SOPs, and ticksheets.</p>
        </div>
        
        <div className="relative w-full sm:w-auto self-start sm:self-auto">
          <button 
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 sm:py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg shadow-blue-600/20 active:scale-95 flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" /> Create New
          </button>
          
          {dropdownOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)}></div>
              <div className="absolute right-0 left-0 sm:left-auto mt-2 w-full sm:w-64 glass-panel border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl z-50 overflow-hidden py-1 animate-in zoom-in-95 duration-200">
                <Link href="/builder" onClick={() => setDropdownOpen(false)} className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group">
                  <div className="bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 p-2.5 rounded-lg group-hover:scale-110 transition-transform">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-800 dark:text-slate-200">Create new ticksheet</div>
                    <div className="text-[11px] text-slate-500 font-medium leading-tight mt-0.5">Build conditional surveys and tasks</div>
                  </div>
                </Link>
                <div onClick={handleCreateFormClick} className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group border-t border-slate-100 dark:border-slate-800">
                  <div className="bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 p-2.5 rounded-lg group-hover:scale-110 transition-transform">
                    <FileSignature className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-800 dark:text-slate-200">Create new form</div>
                    <div className="text-[11px] text-slate-500 font-medium leading-tight mt-0.5">Standard web form data collection</div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Dashboard Grid */}
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100 fill-mode-both">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : questionnaires.length === 0 ? (
          <div className="text-center glass-panel border border-slate-200 dark:border-slate-700/50 rounded-2xl py-20 px-6 shadow-sm">
            <div className="w-20 h-20 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <FileText className="w-10 h-10 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-slate-800 dark:text-slate-200 font-bold text-xl mb-2">No Ticksheets or Forms yet</h3>
            <p className="text-slate-500 text-sm max-w-md mx-auto mb-8">Create your first questionnaire to start collecting data from your team or customers.</p>
            <Link href="/builder" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl text-sm font-bold transition-all shadow-lg shadow-blue-600/20 active:scale-95 inline-flex items-center gap-2">
              <Plus className="w-4 h-4" /> Create Questionnaire
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {questionnaires.map((q: any) => (
              <div key={q._id} className="glass-panel border border-slate-200/50 dark:border-slate-700/50 rounded-2xl p-6 hover:border-blue-500/50 hover:shadow-xl transition-all duration-300 group flex flex-col relative cursor-pointer overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                
                <div className="flex justify-between items-start mb-6">
                  <div className="bg-blue-50 dark:bg-blue-900/30 p-3 rounded-xl group-hover:scale-110 transition-transform">
                    <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="relative">
                    <button 
                      onClick={(e) => { e.stopPropagation(); setOpenMenuId(openMenuId === q._id ? null : q._id); }}
                      className="text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-300 p-1.5 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>
                    
                    {openMenuId === q._id && (
                      <>
                        <div className="fixed inset-0 z-40" onClick={(e) => { e.stopPropagation(); setOpenMenuId(null); }}></div>
                        <div className="absolute right-0 mt-1 w-36 glass-panel border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl z-50 overflow-hidden py-1">
                          <Link href={`/preview/${q._id}`} className="w-full flex items-center gap-2 px-3 py-2 text-[12px] text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-left font-medium">
                            <Eye className="w-3.5 h-3.5 text-slate-400" /> View
                          </Link>
                          <Link href={`/builder?id=${q._id}`} className="w-full flex items-center gap-2 px-3 py-2 text-[12px] text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-left font-medium">
                            <Edit className="w-3.5 h-3.5 text-slate-400" /> Edit
                          </Link>
                          <button onClick={(e) => { e.stopPropagation(); handleCopy(q); }} className="w-full flex items-center gap-2 px-3 py-2 text-[12px] text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-left font-medium">
                            <Copy className="w-3.5 h-3.5 text-slate-400" /> Copy
                          </button>
                          <div className="border-t border-slate-100 dark:border-slate-800 my-1"></div>
                          <button onClick={(e) => { e.stopPropagation(); handleDelete(q._id); }} className="w-full flex items-center gap-2 px-3 py-2 text-[12px] text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-left font-bold">
                            <Trash className="w-3.5 h-3.5" /> Delete
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
                
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 leading-tight mb-2 line-clamp-2">
                    {q.title || 'Untitled Form'}
                  </h3>
                </div>
                
                <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/50">
                  <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-full text-[10px] font-extrabold uppercase tracking-widest">
                    Ticksheet
                  </span>
                  <span className="text-xs font-semibold text-slate-400">
                    {new Date(q.createdAt).toLocaleDateString('en-GB')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
