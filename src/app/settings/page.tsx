"use client";

import React from 'react';
import { LogOut, User, Bell, Shield, PaintBucket } from 'lucide-react';
import Link from 'next/link';

export default function SettingsPage() {
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
