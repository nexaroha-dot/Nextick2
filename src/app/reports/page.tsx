"use client";

import React, { useState } from 'react';
import { PieChart, FileText, Calendar, LayoutGrid, Search } from 'lucide-react';
import Link from 'next/link';

export default function ReportsIndexPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const reports = [
    {
      _id: 'r1',
      title: 'Daily Machine Checklist Report',
      description: 'Monthly summary of machine safety checks and operational status.',
      date: 'May 2026',
      tags: ['Maintenance', 'Monthly']
    },
    {
      _id: 'r2',
      title: 'Site Safety Audit Report',
      description: 'Comprehensive analysis of site safety compliance.',
      date: 'May 2026',
      tags: ['Safety', 'Audit']
    },
    {
      _id: 'r3',
      title: 'Inventory Verification',
      description: 'Stock levels and discrepancy report.',
      date: 'April 2026',
      tags: ['Inventory']
    }
  ];

  const filteredReports = reports.filter(r => r.title.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto bg-slate-50/50 dark:bg-slate-900/50 p-4 md:p-8 font-sans">
      
      {/* Header Area */}
      <div className="pb-8 animate-in fade-in slide-in-from-top-4 duration-500">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
          <PieChart className="w-8 h-8 text-blue-600" /> Reports Dashboard
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 font-medium">
          View analytics, performance tracking, and structured response grids for all your forms.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-8 flex items-center gap-4 animate-in fade-in duration-700">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search reports..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-10 pr-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700 dark:text-slate-200 shadow-sm"
          />
        </div>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100 fill-mode-both">
        {filteredReports.map(report => (
          <Link 
            key={report._id} 
            href={`/reports/${report._id}`}
            className="block group"
          >  
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-xl transition-all duration-300 group flex flex-col relative cursor-pointer overflow-hidden shadow-sm h-full">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              
              <div className="flex justify-between items-start mb-4">
                <div className="bg-blue-50 dark:bg-blue-900/30 p-3 rounded-xl group-hover:scale-110 transition-transform">
                  <LayoutGrid className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 bg-slate-100 dark:bg-slate-700/50 px-2.5 py-1 rounded-md">
                  <Calendar className="w-3.5 h-3.5" />
                  {report.date}
                </div>
              </div>
              
              <div className="flex-1 mb-6">
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 leading-tight mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {report.title}
                </h3>
                <p className="text-[13px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                  {report.description}
                </p>
              </div>
              
              <div className="flex items-center gap-2 pt-4 border-t border-slate-100 dark:border-slate-700/50 flex-wrap">
                {report.tags.map(tag => (
                  <span key={tag} className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 rounded-md text-[11px] font-bold tracking-wide">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </Link>
        ))}

        {filteredReports.length === 0 && (
          <div className="col-span-full text-center bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl py-16 px-6 shadow-sm">
            <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-slate-800 dark:text-slate-200 font-bold text-lg mb-1">No reports found</h3>
            <p className="text-slate-500 text-[13px]">Try adjusting your search.</p>
          </div>
        )}
      </div>

    </div>
  );
}
