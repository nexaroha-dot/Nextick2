import { getBranches, getDepartments } from "@/actions/settings";
import SettingsClient from "./SettingsClient";

export const metadata = {
  title: "Settings | Nextick2",
};

export default async function SettingsPage() {
  // Fetch initial data on the server
  const branches = await getBranches();
  const departments = await getDepartments();

  return (
    <div className="min-h-screen w-full bg-slate-50 dark:bg-slate-950 p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50">
            Settings & Management
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage your branches, departments, and user access.
          </p>
        </div>

        {/* Client component handles tabs and form submissions */}
        <SettingsClient initialBranches={branches} initialDepartments={departments} />
      </div>
    </div>
  );
}
