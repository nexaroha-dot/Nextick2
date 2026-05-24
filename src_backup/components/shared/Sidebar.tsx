"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CheckSquare,
  FileText,
  PlusSquare,
  BarChart3,
  Database,
  Settings,
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Tick Sheet", href: "/tick-sheet", icon: CheckSquare },
  { name: "Forms", href: "/forms", icon: FileText },
  { name: "Create", href: "/create", icon: PlusSquare },
  { name: "Reports", href: "/reports", icon: BarChart3 },
  { name: "Storage", href: "/storage", icon: Database },
  { name: "Settings", href: "/settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  // Optimized list of 5 main items for the mobile bottom navigation bar
  const mobileNavigation = [
    navigation[0], // Dashboard
    navigation[1], // Tick Sheet
    navigation[2], // Forms
    navigation[3], // Create
    navigation[6], // Settings
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:flex h-full w-64 flex-col border-r border-slate-200/50 dark:border-slate-800/50 glass z-10 relative">
        <div className="flex h-16 items-center px-6 border-b border-slate-200/50 dark:border-slate-800/50">
          <Link href="/" className="flex items-center gap-3 font-bold text-blue-600 dark:text-blue-400 group">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-600 text-white shadow-md shadow-blue-600/20 group-hover:scale-105 transition-transform">
              <LayoutDashboard className="w-4 h-4" />
            </div>
            <span className="text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">Nextick2</span>
          </Link>
        </div>
        <div className="flex-1 overflow-auto py-4">
          <nav className="grid items-start px-3 text-sm font-medium gap-1">
            {navigation.map((item) => {
              const isActive = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-300 ${
                    isActive
                      ? "bg-blue-600/10 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300 font-semibold shadow-sm"
                      : "text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50/50 dark:hover:bg-slate-800/50"
                  }`}
                >
                  <item.icon className={`h-4 w-4 ${isActive ? "text-blue-600 dark:text-blue-400" : ""}`} />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white/90 dark:bg-slate-900/90 border-t border-slate-200/50 dark:border-slate-800/50 backdrop-blur-lg flex items-center justify-around px-2 z-50 shadow-[0_-4px_20px_-4px_rgba(0,0,0,0.08)] dark:shadow-[0_-4px_20px_-4px_rgba(0,0,0,0.3)]">
        {mobileNavigation.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center justify-center gap-1 w-14 h-12 rounded-xl transition-all duration-300 active:scale-95 ${
                isActive
                  ? "text-blue-600 dark:text-blue-400 font-semibold"
                  : "text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400"
              }`}
            >
              <div className={`p-1 rounded-lg transition-colors ${isActive ? "bg-blue-50 dark:bg-blue-900/30" : ""}`}>
                <item.icon className="h-5 w-5" />
              </div>
              <span className="text-[10px] tracking-tight">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </>
  );
}
