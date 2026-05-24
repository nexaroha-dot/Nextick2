"use client";

import React, { useState, useTransition } from "react";
import { Plus, Building2, Layers, Users, Building, AlertCircle } from "lucide-react";
import { addBranch, addDepartment } from "@/actions/settings";

type Tab = "branch" | "department" | "users";

export default function SettingsClient({
  initialBranches,
  initialDepartments,
}: {
  initialBranches: any[];
  initialDepartments: any[];
}) {
  const [activeTab, setActiveTab] = useState<Tab>("branch");

  return (
    <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xl">
      
      {/* Navigation Tabs */}
      <div className="flex overflow-x-auto border-b border-slate-200 dark:border-slate-800 scrollbar-hide">
        <button
          onClick={() => setActiveTab("branch")}
          className={`flex items-center gap-2 px-6 py-4 text-sm font-bold transition-all whitespace-nowrap ${
            activeTab === "branch"
              ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400 bg-blue-50/50 dark:bg-blue-900/10"
              : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/50"
          }`}
        >
          <Building2 className="w-4 h-4" />
          Branch
        </button>
        <button
          onClick={() => setActiveTab("department")}
          className={`flex items-center gap-2 px-6 py-4 text-sm font-bold transition-all whitespace-nowrap ${
            activeTab === "department"
              ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400 bg-blue-50/50 dark:bg-blue-900/10"
              : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/50"
          }`}
        >
          <Layers className="w-4 h-4" />
          Department
        </button>
        <button
          onClick={() => setActiveTab("users")}
          className={`flex items-center gap-2 px-6 py-4 text-sm font-bold transition-all whitespace-nowrap ${
            activeTab === "users"
              ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400 bg-blue-50/50 dark:bg-blue-900/10"
              : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/50"
          }`}
        >
          <Users className="w-4 h-4" />
          User Management
        </button>
      </div>

      {/* Tab Content */}
      <div className="p-6 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {activeTab === "branch" && <BranchTab branches={initialBranches} />}
        {activeTab === "department" && <DepartmentTab departments={initialDepartments} />}
        {activeTab === "users" && <UserManagementTab />}
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// BRANCH TAB
// -------------------------------------------------------------
function BranchTab({ branches }: { branches: any[] }) {
  const [isPending, startTransition] = useTransition();
  const [errorMsg, setErrorMsg] = useState("");

  const handleAction = async (formData: FormData) => {
    setErrorMsg("");
    startTransition(async () => {
      const res = await addBranch(null, formData);
      if (res?.error) setErrorMsg(res.error);
    });
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <Building className="w-5 h-5 text-blue-500" />
          Add New Branch
        </h2>
        <p className="text-sm text-slate-500 mt-1">Create a new branch location for your company.</p>
      </div>

      {errorMsg && (
        <div className="flex items-center gap-2 p-3 text-sm text-red-600 bg-red-50 dark:bg-red-950/50 dark:text-red-400 rounded-lg border border-red-200 dark:border-red-900/50">
          <AlertCircle className="w-4 h-4" />
          <p>{errorMsg}</p>
        </div>
      )}

      <form action={handleAction} className="flex flex-col sm:flex-row gap-4">
        <input
          type="text"
          name="branch"
          required
          placeholder="e.g. New York HQ"
          className="flex-1 px-4 py-2.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all shadow-sm"
        />
        <button
          type="submit"
          disabled={isPending}
          className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl transition-all active:scale-95 disabled:opacity-70 flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 whitespace-nowrap"
        >
          {isPending ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Plus className="w-4 h-4" />
          )}
          Add Branch
        </button>
      </form>

      <div className="pt-6 border-t border-slate-200 dark:border-slate-800">
        <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-4 uppercase tracking-wider">
          Existing Branches ({branches.length})
        </h3>
        {branches.length === 0 ? (
          <div className="text-center py-10 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800 border-dashed">
            <p className="text-slate-500 dark:text-slate-400 text-sm">No branches found. Add one above.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {branches.map((b) => (
              <div key={b.id} className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-3 group hover:border-blue-400 dark:hover:border-blue-500 transition-colors">
                <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <Building2 className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-100 truncate">{b.branch}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">ID: {b.id}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// DEPARTMENT TAB
// -------------------------------------------------------------
function DepartmentTab({ departments }: { departments: any[] }) {
  const [isPending, startTransition] = useTransition();
  const [errorMsg, setErrorMsg] = useState("");

  const handleAction = async (formData: FormData) => {
    setErrorMsg("");
    startTransition(async () => {
      const res = await addDepartment(null, formData);
      if (res?.error) setErrorMsg(res.error);
    });
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <Layers className="w-5 h-5 text-indigo-500" />
          Add New Department
        </h2>
        <p className="text-sm text-slate-500 mt-1">Create a new department within your organization.</p>
      </div>

      {errorMsg && (
        <div className="flex items-center gap-2 p-3 text-sm text-red-600 bg-red-50 dark:bg-red-950/50 dark:text-red-400 rounded-lg border border-red-200 dark:border-red-900/50">
          <AlertCircle className="w-4 h-4" />
          <p>{errorMsg}</p>
        </div>
      )}

      <form action={handleAction} className="flex flex-col sm:flex-row gap-4">
        <input
          type="text"
          name="department"
          required
          placeholder="e.g. Human Resources"
          className="flex-1 px-4 py-2.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all shadow-sm"
        />
        <button
          type="submit"
          disabled={isPending}
          className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl transition-all active:scale-95 disabled:opacity-70 flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 whitespace-nowrap"
        >
          {isPending ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Plus className="w-4 h-4" />
          )}
          Add Department
        </button>
      </form>

      <div className="pt-6 border-t border-slate-200 dark:border-slate-800">
        <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-4 uppercase tracking-wider">
          Existing Departments ({departments.length})
        </h3>
        {departments.length === 0 ? (
          <div className="text-center py-10 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800 border-dashed">
            <p className="text-slate-500 dark:text-slate-400 text-sm">No departments found. Add one above.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {departments.map((d) => (
              <div key={d.id} className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-3 group hover:border-indigo-400 dark:hover:border-indigo-500 transition-colors">
                <div className="w-10 h-10 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <Layers className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-100 truncate">{d.department}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">ID: {d.id}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// USER MANAGEMENT TAB (BLANK PLACEHOLDER)
// -------------------------------------------------------------
function UserManagementTab() {
  return (
    <div className="py-12 flex flex-col items-center justify-center text-center">
      <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center mb-4 border border-slate-200 dark:border-slate-700 shadow-sm">
        <Users className="w-8 h-8 text-slate-400" />
      </div>
      <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">User Management</h2>
      <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
        This module is currently blank and under construction. You will soon be able to manage roles, permissions, and status for all active users within your company.
      </p>
    </div>
  );
}
