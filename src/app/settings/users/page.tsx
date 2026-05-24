import { Users, Plus, Search } from "lucide-react";

export const metadata = {
  title: "User Management | Nextick2",
};

export default function UsersPage() {
  return (
    <div className="min-h-screen w-full bg-slate-50 dark:bg-slate-950 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
            User Management
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage roles, permissions, and status for all active users within your company.
          </p>
        </div>

        {/* Top Header Actions (Disabled for placeholder) */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 opacity-50 pointer-events-none">
          <div className="relative w-full max-w-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="Search users..."
              disabled
              className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-800 rounded-lg text-sm bg-white dark:bg-slate-900"
            />
          </div>
          
          <button
            disabled
            className="px-4 py-2 bg-blue-600 text-white text-sm font-bold rounded-lg flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add User
          </button>
        </div>

        {/* Flat Data Table Placeholder */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="px-6 py-4">ID</th>
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-slate-800 dark:text-slate-200">
                <tr>
                  <td colSpan={4} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800/50 rounded-full flex items-center justify-center mb-4 border border-slate-100 dark:border-slate-800">
                        <Users className="w-8 h-8 text-slate-300 dark:text-slate-600" />
                      </div>
                      <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300">No Users Configured</h3>
                      <p className="text-sm text-slate-500 max-w-sm mt-2">
                        This module is currently under construction. You will soon be able to add members, manage roles, and control access directly from this table.
                      </p>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
