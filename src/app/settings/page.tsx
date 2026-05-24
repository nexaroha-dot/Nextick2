import Link from "next/link";
import { Building2, Layers, Users, ChevronRight } from "lucide-react";

export const metadata = {
  title: "Admin Settings | Nextick2",
};

const settingsModules = [
  {
    name: "Branch Management",
    description: "Manage organizational branches and office locations.",
    href: "/settings/branch",
    icon: Building2,
    color: "text-blue-600 dark:text-blue-400",
    bgColor: "bg-blue-50 dark:bg-blue-900/20",
  },
  {
    name: "Department Management",
    description: "Organize and configure company departments.",
    href: "/settings/department",
    icon: Layers,
    color: "text-indigo-600 dark:text-indigo-400",
    bgColor: "bg-indigo-50 dark:bg-indigo-900/20",
  },
  {
    name: "User Management",
    description: "Control access, assign roles, and manage team members.",
    href: "/settings/users",
    icon: Users,
    color: "text-amber-600 dark:text-amber-400",
    bgColor: "bg-amber-50 dark:bg-amber-900/20",
  },
];

export default function SettingsIndexPage() {
  return (
    <div className="min-h-screen w-full bg-slate-50 dark:bg-slate-950 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
            Admin Settings
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Select a module below to configure your company's settings.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {settingsModules.map((module) => (
            <Link
              key={module.name}
              href={module.href}
              className="flex items-center p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 transition-all active:scale-[0.98] group"
            >
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center shrink-0 ${module.bgColor}`}>
                <module.icon className={`w-6 h-6 ${module.color}`} />
              </div>
              <div className="ml-4 flex-1">
                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm md:text-base group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {module.name}
                </h3>
                <p className="text-[11px] md:text-xs text-slate-500 line-clamp-2 mt-0.5">
                  {module.description}
                </p>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-300 dark:text-slate-600 shrink-0 group-hover:text-blue-500 transition-colors" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
