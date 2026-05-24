"use client";

import React, { useState } from 'react';
import { ArrowLeft, Search, Calendar, User, FileText, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

// Mock Data
const MOCK_USERS = [
  { id: 'u1', name: 'Mayur Raval' },
  { id: 'u2', name: 'Rahul Sharma' },
  { id: 'u3', name: 'Amit Patel' }
];

const MOCK_DATES = [
  '24 May 2026',
  '23 May 2026',
  '22 May 2026',
  '21 May 2026'
];

const MOCK_PAST_RESPONSES = [
  {
    id: 'q1',
    title: 'Machine Status',
    type: 'Dropdown',
    answer: 'Operational',
    points: 10
  },
  {
    id: 'q2',
    title: 'Safety Check Completed?',
    type: 'Yes/No',
    answer: 'Yes',
    points: 5
  },
  {
    id: 'q3',
    title: 'Any issues observed?',
    type: 'Short Text',
    answer: 'Slight vibration in motor B.',
    points: 0
  }
];

export default function PastResponsesPage({ params }: { params: { id: string } }) {
  // Hardcoded for demo as per user request
  const userRole = 'Editor'; // Change this to 'Viewer' in code to test read-only mode

  const [selectedUserId, setSelectedUserId] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSearch = () => {
    if (selectedUserId && selectedDate) {
      setShowForm(true);
    } else {
      alert('Please select both User and Date first.');
    }
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      alert('Changes updated successfully!');
    }, 1000);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50/50 dark:bg-slate-900/50 font-sans overflow-y-auto">
      {/* Header */}
      <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link 
              href="/tick-sheet" 
              className="p-2 -ml-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-500" />
                Past Ticksheet Responses
              </h1>
              <p className="text-[13px] text-slate-500 font-medium">Form ID: {params.id}</p>
            </div>
          </div>
          
          {/* User Role Indicator */}
          <div className="flex items-center gap-2 bg-indigo-50 dark:bg-indigo-900/30 px-4 py-1.5 rounded-full border border-indigo-100 dark:border-indigo-800/50">
            <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
            <span className="text-[13px] font-semibold text-indigo-700 dark:text-indigo-300">
              Your Access: {userRole}
            </span>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Search / Filter Section */}
        <section className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200/50 dark:border-slate-700/50 p-6">
          <h2 className="text-[15px] font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
            <Search className="w-4 h-4 text-blue-500" /> Find Past Submission
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* User Select */}
            <div className="space-y-1.5">
              <label className="text-[13px] font-medium text-slate-600 dark:text-slate-400 ml-1">Select User</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="w-4 h-4 text-slate-400" />
                </div>
                <select 
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl text-[14px] text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                  value={selectedUserId}
                  onChange={(e) => { setSelectedUserId(e.target.value); setShowForm(false); }}
                >
                  <option value="" disabled>Choose a responder...</option>
                  {MOCK_USERS.map(u => (
                    <option key={u.id} value={u.id}>{u.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Date Select */}
            <div className="space-y-1.5">
              <label className="text-[13px] font-medium text-slate-600 dark:text-slate-400 ml-1">Select Date</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar className="w-4 h-4 text-slate-400" />
                </div>
                <select 
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl text-[14px] text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                  value={selectedDate}
                  onChange={(e) => { setSelectedDate(e.target.value); setShowForm(false); }}
                >
                  <option value="" disabled>Choose submission date...</option>
                  {MOCK_DATES.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button 
              onClick={handleSearch}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition-colors flex items-center gap-2 shadow-sm"
            >
              View Responses
            </button>
          </div>
        </section>

        {/* Responses Section */}
        {showForm && (
          <section className="space-y-4 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
                Responses for {MOCK_USERS.find(u => u.id === selectedUserId)?.name}
              </h3>
              <span className="text-[13px] font-medium text-slate-500 bg-slate-200 dark:bg-slate-800 px-3 py-1 rounded-full">
                {selectedDate}
              </span>
            </div>

            {/* Render Mock Questions */}
            {MOCK_PAST_RESPONSES.map((q, index) => (
              <div key={q.id} className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200/50 dark:border-slate-700/50 p-6 transition-all hover:border-slate-300 dark:hover:border-slate-600 group relative">
                
                <div className="flex items-start gap-4">
                  {/* Question Number Badge */}
                  <div className="bg-slate-100 dark:bg-slate-700/50 text-slate-500 dark:text-slate-400 font-bold w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 text-sm">
                    {index + 1}
                  </div>
                  
                  <div className="flex-1 space-y-4">
                    <div className="flex justify-between items-start">
                      <h3 className="text-[16px] font-semibold text-slate-800 dark:text-slate-100 leading-snug">
                        {q.title}
                      </h3>
                      {q.points > 0 && (
                        <div className="bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-bold text-[12px] px-2.5 py-1 rounded-md ml-4 shrink-0 border border-blue-100 dark:border-blue-800/50">
                          {q.points} pts
                        </div>
                      )}
                    </div>

                    {/* Input Field based on user role */}
                    <div className="pt-2">
                      {q.type === 'Dropdown' && (
                        <select 
                          className="w-full p-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl text-[14px] text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed disabled:bg-slate-100 dark:disabled:bg-slate-800"
                          defaultValue={q.answer}
                          disabled={userRole !== 'Editor'}
                        >
                          <option value="Operational">Operational</option>
                          <option value="Under Maintenance">Under Maintenance</option>
                          <option value="Offline">Offline</option>
                        </select>
                      )}

                      {q.type === 'Yes/No' && (
                        <div className="flex gap-4">
                          {['Yes', 'No'].map(opt => (
                            <label key={opt} className={`flex items-center gap-2 p-3 rounded-xl border ${userRole !== 'Editor' ? 'cursor-not-allowed opacity-70 bg-slate-50 dark:bg-slate-900/30' : 'cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 bg-white dark:bg-slate-800'}`}>
                              <input 
                                type="radio" 
                                name={`q_${q.id}`} 
                                value={opt} 
                                defaultChecked={q.answer === opt}
                                disabled={userRole !== 'Editor'}
                                className="w-4 h-4 text-blue-600 focus:ring-blue-500 disabled:opacity-70"
                              />
                              <span className="text-[14px] font-medium text-slate-700 dark:text-slate-300">{opt}</span>
                            </label>
                          ))}
                        </div>
                      )}

                      {q.type === 'Short Text' && (
                        <input 
                          type="text" 
                          defaultValue={q.answer}
                          disabled={userRole !== 'Editor'}
                          className="w-full p-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl text-[14px] text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed disabled:bg-slate-100 dark:disabled:bg-slate-800"
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Action Area for Editor */}
            {userRole === 'Editor' ? (
              <div className="pt-6 border-t border-slate-200 dark:border-slate-800">
                <button 
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="w-full md:w-auto md:min-w-[200px] bg-green-600 hover:bg-green-700 disabled:bg-green-600/70 text-white px-8 py-3.5 rounded-xl text-[15px] font-bold shadow-lg shadow-green-600/20 flex items-center justify-center gap-2 transition-transform active:scale-95 ml-auto"
                >
                  {isSubmitting ? 'Updating...' : <><CheckCircle2 className="w-5 h-5" /> Submit Ticksheet</>}
                </button>
              </div>
            ) : (
              <div className="pt-6 text-center text-slate-500 text-sm flex justify-center items-center gap-2">
                <FileText className="w-4 h-4" /> You have Viewer access. This submission is read-only.
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
}
