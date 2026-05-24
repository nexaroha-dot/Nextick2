"use client";
import React from 'react';
import { usePathname } from 'next/navigation';
import Sidebar from '@/components/shared/Sidebar';

export default function ClientLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname === '/login' || pathname === '/signup';

  if (isAuthPage) {
    return (
      <main className="flex-1 h-full w-full overflow-y-auto">
        {children}
      </main>
    );
  }

  return (
    <>
      <Sidebar />
      <main className="flex-1 overflow-y-auto pb-16 md:pb-0 relative">
        {children}
      </main>
    </>
  );
}
