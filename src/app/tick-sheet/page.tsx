"use client";

import React, { useState } from 'react';
import { CheckSquare, Clock, ArrowRight, ClipboardList, Calendar } from 'lucide-react';
import Link from 'next/link';

export default function TickSheetModulePage() {
  const [activeTab, setActiveTab] = useState('pending');

  // Mock data representing ticksheets available to fill
  const ticksheets = [
    {
      _id: 't1',
      title: 'Daily Machine Checklist',
      description: 'Morning inspection for all heavy machinery before operation.',
      frequency: 'Daily',
      status: 'pending',
      dueDate: 'Today, 10:00 AM'
    },
    {
      _id: 't2',
      title: 'Site Safety Audit',
      description: 'Comprehensive safety check for construction zone A.',
      frequency: 'Weekly',
      status: 'pending',
      dueDate: 'Tomorrow, 05:00 PM'
    },
    {
      _id: 't3',
      title: 'Employee Feedback Form',
      description: 'Monthly collection of feedback from the floor staff.',
      frequency: 'Monthly',
      status: 'completed',
      dueDate: 'Completed on 12th Oct'
    }
  ];

  const filteredSheets = ticksheets.filter(t => t.status === activeTab);

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto bg-transparent p-4 md:p-8 font-sans">
      
      {/* Header Area */}
      <div className="pb-6 animate-in fade-in slide-in-from-top-4 duration-500">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Ticksheets</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">
          Select a ticksheet below to fill out the questions and submit your report.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-8 animate-in fade-in duration-700">
        <button 
          onClick={() => setActiveTab('pending')}
          className={`px-4 py-2 rounded-lg text-[13px] font-bold transition-all ${activeTab === 'pending' ? 'bg-blue-600 text-white shadow-md' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50'}`}
        >
          Pending Tasks
        </button>
        <button 
          onClick={() => setActiveTab('completed')}
          className={`px-4 py-2 rounded-lg text-[13px] font-bold transition-all ${activeTab === 'completed' ? 'bg-green-600 text-white shadow-md' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50'}`}
        >
          Completed
        </button>
      </div>

      {/* Ticksheet Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100 fill-mode-both">
        {filteredSheets.length === 0 ? (
          <div className="col-span-full text-center glass-panel border border-slate-200 dark:border-slate-700/50 rounded-2xl py-16 px-6 shadow-sm">
            <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckSquare className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-slate-800 dark:text-slate-200 font-bold text-lg mb-1">No {activeTab} ticksheets</h3>
            <p className="text-slate-500 text-[13px]">You're all caught up for now!</p>
          </div>
        ) : (
          filteredSheets.map((sheet) => (
            <Link href={`/tick-sheet/fill/${sheet._id}`} key={sheet._id}>
              <div className="glass-panel border border-slate-200/50 dark:border-slate-700/50 rounded-2xl p-6 hover:border-blue-500/50 hover:shadow-xl transition-all duration-300 group flex flex-col h-full relative overflow-hidden bg-white/60 dark:bg-slate-900/60 cursor-pointer">
                
                {/* Top decorative line */}
                <div className={`absolute top-0 left-0 w-full h-1 opacity-0 group-hover:opacity-100 transition-opacity ${activeTab === 'completed' ? 'bg-gradient-to-r from-green-400 to-emerald-500' : 'bg-gradient-to-r from-blue-400 to-indigo-500'}`}></div>
                
                {/* Icon & Status */}
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-3 rounded-xl group-hover:scale-110 transition-transform ${activeTab === 'completed' ? 'bg-green-50 dark:bg-green-900/30' : 'bg-blue-50 dark:bg-blue-900/30'}`}>
                    <ClipboardList className={`w-5 h-5 ${activeTab === 'completed' ? 'text-green-600 dark:text-green-400' : 'text-blue-600 dark:text-blue-400'}`} />
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest ${activeTab === 'completed' ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400' : 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400'}`}>
                    {sheet.frequency}
                  </span>
                </div>
                
                {/* Content */}
                <div className="flex-1 mb-6">
                  <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 leading-tight mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {sheet.title}
                  </h3>
                  <p className="text-[13px] text-slate-500 dark:text-slate-400 line-clamp-2">
                    {sheet.description}
                  </p>
                </div>
                
                {/* Footer details */}
                <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800/50 flex flex-col gap-3">
                  <div className="flex items-center gap-2 text-[12px] font-semibold text-slate-500">
                    {activeTab === 'completed' ? <Calendar className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                    {sheet.dueDate}
                  </div>
                  
                  <button className={`w-full flex items-center justify-center gap-2 py-2 rounded-lg text-[12px] font-bold transition-all ${activeTab === 'completed' ? 'bg-slate-100 text-slate-600 group-hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:group-hover:bg-slate-700' : 'bg-blue-50 text-blue-700 group-hover:bg-blue-600 group-hover:text-white dark:bg-blue-900/30 dark:text-blue-400'}`}>
                    {activeTab === 'completed' ? 'View Submission' : 'Start Ticksheet'}
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
                
              </div>
            </Link>
          ))
        )}
      </div>

    </div>
  );
}
