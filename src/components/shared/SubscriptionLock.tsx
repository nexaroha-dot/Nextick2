"use client";

import { Lock } from "lucide-react";

interface SubscriptionLockProps {
  isExpired: boolean;
  children: React.ReactNode;
}

export default function SubscriptionLock({ isExpired, children }: SubscriptionLockProps) {
  if (!isExpired) {
    return <>{children}</>;
  }

  return (
    <div className="relative w-full h-full min-h-[500px]">
      {/* Blurred out content behind the lock */}
      <div className="opacity-30 blur-sm pointer-events-none select-none h-full">
        {children}
      </div>

      {/* Lock Overlay */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-6 text-center">
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-slate-800 shadow-2xl rounded-2xl p-8 max-w-md w-full animate-in zoom-in-95 duration-300">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock className="w-8 h-8" />
          </div>
          
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mb-3">
            Plan Expired
          </h2>
          
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
            Your SaaS subscription has expired. The application is currently in View-Only mode. 
            Data creation and modification have been disabled until the plan is renewed.
          </p>

          <div className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            Contact Administration to Renew
          </div>
        </div>
      </div>
    </div>
  );
}
