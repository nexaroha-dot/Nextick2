"use client";

import React, { useState, useEffect } from 'react';
import { LogOut, User, Bell, Shield, PaintBucket, FileText } from 'lucide-react';
import Link from 'next/link';

export default function SettingsPage() {
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

  const handleToggleQuestionnairePoints = () => {
    const newVal = !showPointsInQuestionnaire;
    setShowPointsInQuestionnaire(newVal);
    saveSettings({ showPointsInQuestionnaire: newVal, showPointsInTicksheet });
  };

  const handleToggleTicksheetPoints = () => {
    const newVal = !showPointsInTicksheet;
    setShowPointsInTicksheet(newVal);
    saveSettings({ showPointsInQuestionnaire, showPointsInTicksheet: newVal });
  };

  const saveSettings = (settings: any) => {
    localStorage.setItem('nextick_global_settings', JSON.stringify(settings));
  };

  const handleLogout = () => {
    // In a real app, clear tokens/session here
    window.location.href = '/login';
  };

  return (
    <div className="p-8 max-w-4xl mx-auto animate-in fade-in duration-500">
      <header className="mb-8">
        <h1 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400 tracking-tight">
          Settings
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">
          Manage your account settings and preferences.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Settings Navigation Sidebar */}
        <div className="md:col-span-1 space-y-1">
          {[
            { icon: User, label: 'Profile', active: true },
            { icon: PaintBucket, label: 'Appearance', active: false },
            { icon: Bell, label: 'Notifications', active: false },
            { icon: Shield, label: 'Security', active: false },
          ].map((item, idx) => (
            <button key={idx} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${item.active ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
              <item.icon className="w-4 h-4" />
              {item.label}
            </button>
          ))}
        </div>

        {/* Main Settings Area */}
        <div className="md:col-span-2 space-y-6">

          {/* Form Preferences */}
          <div className="glass-panel p-6 border border-slate-200/50 dark:border-slate-700/50 rounded-2xl shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-lg text-purple-600 dark:text-purple-400">
                <FileText className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200">Form Preferences</h2>
            </div>
            
            <div className="space-y-4">
              <label className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                <div>
                  <div className="text-sm font-bold text-slate-800 dark:text-slate-200">Show Points in Questionnaire</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Display maximum available points on question cards.</div>
                </div>
                <div className="relative inline-flex items-center">
                  <input type="checkbox" className="sr-only peer" checked={showPointsInQuestionnaire} onChange={handleToggleQuestionnairePoints} />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </div>
              </label>

              <label className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                <div>
                  <div className="text-sm font-bold text-slate-800 dark:text-slate-200">Show Point Count After Filling</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Show earned points immediately after answering a question.</div>
                </div>
                <div className="relative inline-flex items-center">
                  <input type="checkbox" className="sr-only peer" checked={showPointsInTicksheet} onChange={handleToggleTicksheetPoints} />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </div>
              </label>
            </div>
          </div>

          <div className="glass-panel p-6 border border-slate-200/50 dark:border-slate-700/50 rounded-2xl shadow-sm">
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-4">Account Logout</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
              Click the button below to securely log out of your Nextick2 account. You will be redirected to the login page.
            </p>
            
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 px-5 py-2.5 bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/40 border border-red-200 dark:border-red-800/50 rounded-xl text-sm font-bold transition-all shadow-sm active:scale-95"
            >
              <LogOut className="w-4 h-4" />
              Log Out
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
