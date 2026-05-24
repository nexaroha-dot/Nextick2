import { getBranches } from "@/actions/settings";
import BranchForm from "./BranchForm";

export const metadata = {
  title: "Branch Settings | Nextick2",
};

export default async function BranchPage() {
  const branches = await getBranches();

  return (
    <div className="min-h-screen w-full bg-slate-50 dark:bg-slate-950 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50">
            Branch Management
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            View and manage organizational branches for your company.
          </p>
        </div>

        <BranchForm branches={branches} />
      </div>
    </div>
  );
}
