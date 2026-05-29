import React from 'react';
import { getTemplateById } from '@/actions/fill';
import FillClient from './FillClient';

export default async function FillPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const res = await getTemplateById('ticksheet', id);
  
  if (!res.success) {
    return (
      <div className="flex h-full items-center justify-center p-8 bg-slate-50 dark:bg-slate-900">
        <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-sm border border-red-100 dark:border-red-900 text-center max-w-md">
          <h2 className="text-xl font-bold text-red-600 dark:text-red-400 mb-2">Access Denied</h2>
          <p className="text-slate-600 dark:text-slate-400">{res.error}</p>
        </div>
      </div>
    );
  }

  return <FillClient template={res.data} type="ticksheet" />;
}
