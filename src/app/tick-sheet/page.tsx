"use client";

import React, { useState } from 'react';
import { CheckSquare, FileText, Clock } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export default function TickSheetModulePage() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') || 'today';
  const [activeTab, setActiveTab] = useState(initialTab);

  // Mock data representing ticksheets available to fill (Today's) and unique forms (Past)
  const ticksheets = [
    {
      _id: 't1',
      title: 'Daily Machine Checklist',
      status: 'today',
      date: 'Active',
      endDate: 'Ends Today, 11:59 PM'
    },
    {
      _id: 't2',
      title: 'Site Safety Audit',
      status: 'today',
      date: 'Active',
      endDate: 'Ends Today, 06:00 PM'
    },
    {
      _id: 't3',
      title: 'End of Shift Compliance',
      status: 'today',
      date: 'Active',
      endDate: 'Ends Today, 10:00 PM'
    },
    {
      _id: 'p1',
      title: 'Weekly Maintenance Log',
      status: 'past',
      date: '21/05/2026',
      endDate: 'Ended 21/05/2026'
    },
    {
      _id: 'p2',
      title: 'Inventory Verification',
      status: 'past',
      date: '20/05/2026',
      endDate: 'Ended 20/05/2026'
    },
    {
      _id: 'p3',
      title: 'Incident Report Form',
      status: 'past',
      date: '18/05/2026',
      endDate: 'Ended 18/05/2026'
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
      <div className="flex gap-2 mb-8 animate-in fade-in duration-700 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button 
          onClick={() => setActiveTab('today')}
          className={`px-5 py-2.5 rounded-t-lg text-[14px] font-bold transition-all relative ${activeTab === 'today' ? 'text-blue-600' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'}`}
        >
          Today's
          {activeTab === 'today' && <div className="absolute bottom-[-9px] left-0 w-full h-0.5 bg-blue-600 rounded-t-md"></div>}
        </button>
        <button 
          onClick={() => setActiveTab('past')}
          className={`px-5 py-2.5 rounded-t-lg text-[14px] font-bold transition-all relative ${activeTab === 'past' ? 'text-blue-600' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'}`}
        >
          Past
          {activeTab === 'past' && <div className="absolute bottom-[-9px] left-0 w-full h-0.5 bg-blue-600 rounded-t-md"></div>}
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
          filteredSheets.map(sheet => (
            <Link 
              key={sheet._id} 
              href={sheet.status === 'past' ? `/tick-sheet/past/${sheet._id}` : `/tick-sheet/fill/${sheet._id}`}
              className="block group"
            >
              <div className="glass-panel border border-slate-200/50 dark:border-slate-700/50 rounded-2xl p-6 hover:border-blue-500/50 hover:shadow-xl transition-all duration-300 group flex flex-col relative cursor-pointer overflow-hidden bg-white/60 dark:bg-slate-900/60 shadow-sm h-full">
                {/* Green left border indicator for today cards */}
                {sheet.status === 'today' && <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-green-500"></div>}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                
                <div className="flex justify-between items-start mb-6">
                  <div className="bg-blue-50 dark:bg-blue-900/30 p-3 rounded-xl group-hover:scale-110 transition-transform">
                    <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
                
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 leading-tight mb-2 line-clamp-2">
                    {sheet.title}
                  </h3>
                </div>
                
                <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/50">
                  <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-full text-[10px] font-extrabold uppercase tracking-widest">
                    Ticksheet
                  </span>
                  <span className="text-xs font-semibold text-slate-400">
                    {sheet.date}
                  </span>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>

    </div>
  );
}

