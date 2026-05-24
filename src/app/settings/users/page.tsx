import { Users } from "lucide-react";

export const metadata = {
  title: "User Management | Nextick2",
};

export default function UsersPage() {
  return (
    <div className="min-h-screen w-full bg-slate-50 dark:bg-slate-950 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50">
            User Management
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage roles, permissions, and status for all active users within your company.
          </p>
        </div>

        <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-2xl p-12 shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center mb-6 border border-slate-200 dark:border-slate-700 shadow-sm">
              <Users className="w-10 h-10 text-slate-400" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-3">
              Under Construction
            </h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
              This module is currently blank. Soon, you will be able to easily add and remove members, manage their roles (Leader vs Member), and control system access.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
