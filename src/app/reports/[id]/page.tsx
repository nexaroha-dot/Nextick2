"use client";

import React, { useState } from 'react';
import { ArrowLeft, Save, Filter, Download, PieChart, LayoutGrid, Users, FileText, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

// MOCK DATA
const DAYS_IN_MONTH = 31;
const WEEKS = [
  { name: 'WEEK 1', span: 7 },
  { name: 'WEEK 2', span: 7 },
  { name: 'WEEK 3', span: 7 },
  { name: 'WEEK 4', span: 7 },
  { name: 'WEEK 5', span: 3 },
];
const DAY_LETTERS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

const MOCK_TASKS = [
  { id: 1, name: 'Machine Safety Check', basePoints: 10 },
  { id: 2, name: 'Inventory Count', basePoints: 5 },
  { id: 3, name: 'Clean Workspace', basePoints: 2 },
  { id: 4, name: 'Submit EOD Report', basePoints: 15 },
  { id: 5, name: 'Check Calibration', basePoints: 10 },
  { id: 6, name: 'Log Temperature', basePoints: 5 },
  { id: 7, name: 'Inspect Wires', basePoints: 5 },
  { id: 8, name: 'Team Huddle', basePoints: 2 },
  { id: 9, name: 'Update Dashboard', basePoints: 10 },
  { id: 10, name: 'Lock Doors', basePoints: 2 },
];

// Generate random grid data
const generateGridData = () => {
  const grid: Record<number, Record<number, { completed: boolean, value?: string }>> = {};
  MOCK_TASKS.forEach(task => {
    grid[task.id] = {};
    for (let d = 1; d <= DAYS_IN_MONTH; d++) {
      // Randomly complete tasks
      grid[task.id][d] = { completed: Math.random() > 0.3 };
    }
  });
  return grid;
};

const mockGrid = generateGridData();

export default function ReportDashboard() {
  const [activeTab, setActiveTab] = useState<'ticksheet' | 'points' | 'merged' | 'analytics'>('ticksheet');

  // Calculates total base points earned vs possible
  const totalPossibleBasePoints = MOCK_TASKS.reduce((acc, t) => acc + t.basePoints, 0) * DAYS_IN_MONTH;
  
  let totalEarnedBasePoints = 0;
  MOCK_TASKS.forEach(t => {
    for (let d = 1; d <= DAYS_IN_MONTH; d++) {
      if (mockGrid[t.id][d].completed) {
        totalEarnedBasePoints += t.basePoints;
      }
    }
  });

  const overallProgress = ((totalEarnedBasePoints / totalPossibleBasePoints) * 100).toFixed(1);
  const pieData = [
    { name: 'Earned', value: totalEarnedBasePoints, color: '#0B57D0' },
    { name: 'Remaining', value: totalPossibleBasePoints - totalEarnedBasePoints, color: '#E2E8F0' }
  ];

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50 dark:bg-slate-900 font-sans overflow-hidden">
      
      {/* Header */}
      <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-4 md:px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-4">
          <Link href="/tick-sheet?tab=reports" className="p-2 -ml-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">Daily Machine Checklist Report</h1>
            <p className="text-[13px] text-slate-500 font-medium">May 2026 Dashboard</p>
          </div>
        </div>

        {/* Global Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <select className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1.5 text-sm text-slate-700 dark:text-slate-200 outline-none">
            <option>All Branches</option>
            <option>North Branch</option>
          </select>
          <select className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1.5 text-sm text-slate-700 dark:text-slate-200 outline-none">
            <option>All Designations</option>
            <option>Operator</option>
          </select>
          <select className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1.5 text-sm text-slate-700 dark:text-slate-200 outline-none">
            <option>User: Mayur Raval</option>
            <option>User: Rahul Sharma</option>
          </select>
          <button className="flex items-center gap-2 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 text-blue-600 dark:text-blue-400 px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors border border-blue-200 dark:border-blue-800/50">
            <Save className="w-4 h-4" /> Save View
          </button>
          <button className="flex items-center gap-2 bg-slate-800 hover:bg-slate-900 text-white px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors shadow-sm">
            <Download className="w-4 h-4" /> Export
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 overflow-auto flex flex-col p-4 md:p-6 gap-6">
        
        {/* View Tabs & High Level Stats */}
        <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
          
          <div className="flex bg-white dark:bg-slate-800 p-1 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
            <button 
              onClick={() => setActiveTab('ticksheet')}
              className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'ticksheet' ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
            >
              <LayoutGrid className="w-4 h-4" /> Ticksheet View
            </button>
            <button 
              onClick={() => setActiveTab('points')}
              className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'points' ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
            >
              <CheckCircle2 className="w-4 h-4" /> Points View
            </button>
            <button 
              onClick={() => setActiveTab('merged')}
              className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'merged' ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
            >
              <Users className="w-4 h-4" /> Merged Report
            </button>
            <button 
              onClick={() => setActiveTab('analytics')}
              className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'analytics' ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
            >
              <PieChart className="w-4 h-4" /> Analytics
            </button>
          </div>

          <div className="flex items-center gap-6 bg-white dark:bg-slate-800 px-6 py-3 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
            <div>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Total Base Points</div>
              <div className="text-xl font-black text-slate-800 dark:text-slate-100">{totalEarnedBasePoints} <span className="text-sm font-medium text-slate-400">/ {totalPossibleBasePoints}</span></div>
            </div>
            <div className="w-px h-10 bg-slate-200 dark:bg-slate-700"></div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 relative">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={16} outerRadius={24} startAngle={90} endAngle={-270} dataKey="value" stroke="none">
                      {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                    </Pie>
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>
              <div>
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Progress</div>
                <div className="text-xl font-black text-[#0B57D0]">{overallProgress}%</div>
              </div>
            </div>
          </div>
        </div>

        {/* Excel-Style Grid Container */}
        {activeTab === 'ticksheet' && (
          <div className="flex-1 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col">
            <div className="overflow-auto flex-1 custom-scrollbar relative">
              <table className="w-full text-left border-collapse min-w-[1200px]">
                <thead className="sticky top-0 z-20 bg-slate-100 dark:bg-slate-900/80 backdrop-blur-md shadow-[0_1px_0_rgba(203,213,225,1)] dark:shadow-[0_1px_0_rgba(51,65,85,1)]">
                  
                  {/* Top Header Row (Weeks & Sections) */}
                  <tr>
                    <th className="sticky left-0 z-30 bg-[#A6C4D9] dark:bg-blue-900/80 border-r border-b border-[#8AAEC7] dark:border-blue-800 p-2 min-w-[250px] text-center">
                      <div className="text-[11px] font-extrabold text-white uppercase tracking-widest">Questions / Tasks</div>
                    </th>
                    {WEEKS.map((w, i) => (
                      <th key={i} colSpan={w.span} className="border-r border-b border-[#8AAEC7] dark:border-blue-800 bg-[#A6C4D9] dark:bg-blue-900/80 p-1.5 text-center">
                        <span className="text-[11px] font-extrabold text-white uppercase tracking-widest">{w.name}</span>
                      </th>
                    ))}
                    <th className="border-b border-[#8AAEC7] dark:border-blue-800 bg-[#D4A3A3] dark:bg-red-900/80 p-1.5 text-center min-w-[150px]">
                      <span className="text-[11px] font-extrabold text-white uppercase tracking-widest">Base Pts Progress</span>
                    </th>
                  </tr>

                  {/* Second Header Row (Days M T W) */}
                  <tr className="bg-white dark:bg-slate-800">
                    <th className="sticky left-0 z-30 bg-[#E2ECEF] dark:bg-slate-800 border-r border-b border-slate-200 dark:border-slate-700 p-2 text-center text-xs font-bold text-slate-600 dark:text-slate-300">
                      Task Name
                    </th>
                    {Array.from({ length: DAYS_IN_MONTH }).map((_, i) => (
                      <th key={i} className="border-r border-b border-slate-200 dark:border-slate-700 p-1 text-center text-[10px] font-bold text-slate-500 w-8">
                        {DAY_LETTERS[i % 7]}
                      </th>
                    ))}
                    <th className="border-b border-slate-200 dark:border-slate-700 bg-[#F4EBEB] dark:bg-red-900/20 p-1 text-center">
                      <div className="flex justify-between px-4 text-[10px] font-bold text-slate-600 dark:text-slate-300">
                        <span>%</span>
                        <span>Pts</span>
                      </div>
                    </th>
                  </tr>
                  
                  {/* Third Header Row (Dates 1 2 3) */}
                  <tr className="bg-white dark:bg-slate-800">
                    <th className="sticky left-0 z-30 bg-white dark:bg-slate-800 border-r border-b border-slate-200 dark:border-slate-700 p-2"></th>
                    {Array.from({ length: DAYS_IN_MONTH }).map((_, i) => (
                      <th key={i} className="border-r border-b border-slate-200 dark:border-slate-700 p-1 text-center text-[10px] font-semibold text-slate-400">
                        {i + 1}
                      </th>
                    ))}
                    <th className="border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-1"></th>
                  </tr>
                </thead>
                
                <tbody className="text-sm">
                  {MOCK_TASKS.map((task, tIndex) => {
                    let taskEarned = 0;
                    for(let d=1; d<=DAYS_IN_MONTH; d++) {
                      if(mockGrid[task.id][d].completed) taskEarned += task.basePoints;
                    }
                    const taskPossible = task.basePoints * DAYS_IN_MONTH;
                    const taskPct = ((taskEarned / taskPossible) * 100).toFixed(0);

                    return (
                      <tr key={task.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                        
                        {/* Task Name Sticky Column */}
                        <td className="sticky left-0 z-10 bg-white dark:bg-slate-800 group-hover:bg-slate-50 dark:group-hover:bg-slate-800/50 border-r border-b border-slate-200 dark:border-slate-700 p-3">
                          <div className="flex items-center gap-3">
                            <span className="text-[11px] font-bold text-slate-400 w-4">{tIndex + 1}</span>
                            <span className="font-medium text-slate-700 dark:text-slate-200 truncate max-w-[200px]" title={task.name}>{task.name}</span>
                          </div>
                        </td>

                        {/* Date Grid Cells */}
                        {Array.from({ length: DAYS_IN_MONTH }).map((_, dIndex) => {
                          const isDone = mockGrid[task.id][dIndex + 1].completed;
                          return (
                            <td key={dIndex} className="border-r border-b border-slate-200 dark:border-slate-700 p-0 text-center relative hover:bg-blue-50 dark:hover:bg-blue-900/20">
                              <div className="w-full h-full flex items-center justify-center p-1.5 cursor-pointer">
                                <div className={`w-4 h-4 rounded-[3px] border ${isDone ? 'bg-blue-500 border-blue-500' : 'bg-transparent border-slate-300 dark:border-slate-600'} flex items-center justify-center`}>
                                  {isDone && <CheckCircle2 className="w-3 h-3 text-white" />}
                                </div>
                              </div>
                            </td>
                          );
                        })}

                        {/* Progress Cell */}
                        <td className="border-b border-slate-200 dark:border-slate-700 p-2 text-center bg-white dark:bg-slate-800 group-hover:bg-slate-50 dark:group-hover:bg-slate-800/50">
                          <div className="flex justify-between items-center px-4">
                            <span className="text-[12px] font-bold text-slate-700 dark:text-slate-300">{taskPct}%</span>
                            <span className="text-[12px] font-bold text-slate-500">{taskEarned} <span className="text-[10px] font-normal">/ {taskPossible}</span></span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            
            {/* Footer Summary Strip */}
            <div className="bg-slate-50 dark:bg-slate-900 p-4 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center text-sm font-medium text-slate-600 dark:text-slate-400">
              <div>Showing 10 Tasks • 31 Days</div>
              <div>Report generated on {new Date().toLocaleDateString()}</div>
            </div>
          </div>
        )}

        {/* Points View Placeholder */}
        {activeTab === 'points' && (
          <div className="flex-1 flex items-center justify-center bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
            <div className="text-center">
              <CheckCircle2 className="w-12 h-12 text-blue-400 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Points View</h2>
              <p className="text-slate-500">Scoring and output breakdown will appear here.</p>
            </div>
          </div>
        )}

        {/* Analytics View */}
        {activeTab === 'analytics' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
              <h3 className="text-[13px] font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wider mb-6">Top 10 Most Consistent Tasks</h3>
              <div className="space-y-4">
                {MOCK_TASKS.slice(0, 5).map((t, i) => (
                  <div key={t.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-[10px] font-bold text-slate-500">{i + 1}</span>
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{t.name}</span>
                    </div>
                    <span className="text-sm font-bold text-green-600 dark:text-green-400">95%</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
              <h3 className="text-[13px] font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wider mb-6">Points Distribution</h3>
              <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                      {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                    </Pie>
                    <Tooltip />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Internal CSS for scrollbar styling to make grid look like excel */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9; 
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1; 
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8; 
        }
        .dark .custom-scrollbar::-webkit-scrollbar-track {
          background: #1e293b;
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #475569;
        }
      `}} />
    </div>
  );
}
