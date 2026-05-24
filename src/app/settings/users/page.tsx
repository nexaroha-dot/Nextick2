import { getSession } from "@/services/auth/session";
import { getCompanyUsers } from "@/actions/users";
import { getBranches, getDepartments } from "@/actions/settings";
import UsersClient from "./UsersClient";
import { ShieldAlert } from "lucide-react";

export const metadata = {
  title: "User Management | Nextick2",
};

export default async function UsersPage() {
  const session = await getSession();

  // Security: Block Members from accessing this page entirely
  if (!session || session.role === "Member") {
    return (
      <div className="min-h-screen w-full bg-slate-50 dark:bg-slate-950 p-4 md:p-8 flex items-center justify-center">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 max-w-md text-center shadow-lg">
          <div className="w-16 h-16 bg-red-50 dark:bg-red-900/30 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">Access Denied</h2>
          <p className="text-slate-500 text-sm">
            You do not have permission to view or manage users. This area is restricted to Leaders and Co Leaders.
          </p>
        </div>
      </div>
    );
  }

  // Fetch data
  const { users, error } = await getCompanyUsers();
  const branches = await getBranches();
  const departments = await getDepartments();

  return (
    <div className="min-h-screen w-full bg-slate-50 dark:bg-slate-950 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
            User Management
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage roles, permissions, and status for all active users within your company.
          </p>
        </div>

        {error && (
          <div className="p-4 bg-red-50 text-red-600 rounded-lg border border-red-200 text-sm font-semibold">
            {error}
          </div>
        )}

        <UsersClient 
          users={users} 
          branches={branches} 
          departments={departments} 
          currentUserRole={session.role}
        />
      </div>
    </div>
  );
}
