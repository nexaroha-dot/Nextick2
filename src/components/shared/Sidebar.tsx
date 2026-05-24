"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  CheckSquare,
  FileText,
  PlusSquare,
  BarChart3,
  Database,
  Settings,
  LogOut,
  ChevronDown,
  ChevronRight,
  Building2,
  Layers,
  Users
} from "lucide-react";
import { logoutUser } from "@/actions/auth";

const mainNavigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Tick Sheet", href: "/tick-sheet", icon: CheckSquare },
  { name: "Forms", href: "/forms", icon: FileText },
  { name: "Create", href: "/create", icon: PlusSquare },
  { name: "Reports", href: "/reports", icon: BarChart3 },
  { name: "Storage", href: "/storage", icon: Database },
];

const settingsNavigation = [
  { name: "Branch", href: "/settings/branch", icon: Building2 },
  { name: "Department", href: "/settings/department", icon: Layers },
  { name: "Users", href: "/settings/users", icon: Users },
];

export default function Sidebar({ session }: { session?: any }) {
  const pathname = usePathname();
  const [isSettingsOpen, setIsSettingsOpen] = useState(
    pathname.startsWith("/settings")
  );

  const handleLogout = async () => {
    await logoutUser();
    window.location.href = "/login";
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:flex h-full w-64 flex-col border-r border-slate-200/50 dark:border-slate-800/50 glass z-10 relative bg-white/50 dark:bg-slate-900/50">
        
        {/* Header / Logo */}
        <div className="flex h-16 shrink-0 items-center px-6 border-b border-slate-200/50 dark:border-slate-800/50">
          <Link href="/" className="flex items-center gap-3 font-bold text-blue-600 dark:text-blue-400 group">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-600 text-white shadow-md shadow-blue-600/20 group-hover:scale-105 transition-transform">
              <LayoutDashboard className="w-4 h-4" />
            </div>
            <span className="text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">Nextick2</span>
          </Link>
        </div>
        
        {/* Scrollable Navigation Area */}
        <div className="flex-1 overflow-auto py-4">
          <nav className="grid items-start px-3 text-sm font-medium gap-1">
            
            {/* Main Navigation Links */}
            {mainNavigation.map((item) => {
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

            {/* Collapsible Admin Settings */}
            <div className="mt-2">
              <button
                onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                className={`w-full flex items-center justify-between rounded-xl px-3 py-2.5 transition-all duration-300 ${
                  pathname.startsWith("/settings")
                    ? "text-blue-700 dark:text-blue-300 font-semibold"
                    : "text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50/50 dark:hover:bg-slate-800/50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Settings className={`h-4 w-4 ${pathname.startsWith("/settings") ? "text-blue-600 dark:text-blue-400" : ""}`} />
                  Admin Settings
                </div>
                {isSettingsOpen ? (
                  <ChevronDown className="h-4 w-4 text-slate-400" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-slate-400" />
                )}
              </button>

              {/* Sub-menu items */}
              {isSettingsOpen && (
                <div className="mt-1 ml-4 pl-4 border-l-2 border-slate-200 dark:border-slate-800 flex flex-col gap-1">
                  {settingsNavigation.map((subItem) => {
                    const isSubActive = pathname === subItem.href;
                    return (
                      <Link
                        key={subItem.name}
                        href={subItem.href}
                        className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all duration-200 ${
                          isSubActive
                            ? "text-blue-700 dark:text-blue-400 font-semibold bg-blue-50/50 dark:bg-blue-900/10"
                            : "text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-800/30"
                        }`}
                      >
                        <subItem.icon className={`h-3.5 w-3.5 ${isSubActive ? "text-blue-600 dark:text-blue-400" : "text-slate-400"}`} />
                        {subItem.name}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

          </nav>
        </div>

        {/* User Profile & Logout */}
        <div className="shrink-0 p-4 border-t border-slate-200/50 dark:border-slate-800/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                <span className="text-sm font-bold text-slate-600 dark:text-slate-300 uppercase">
                  {session?.username?.charAt(0) || "U"}
                </span>
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">
                  {session?.username || "User"}
                </p>
                <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 truncate">
                  {session?.role || "Member"}
                </p>
              </div>
            </div>
            
            <button 
              onClick={handleLogout}
              className="p-2 text-slate-400 hover:text-red-600 dark:hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors shrink-0"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white/90 dark:bg-slate-900/90 border-t border-slate-200/50 dark:border-slate-800/50 backdrop-blur-lg flex items-center justify-around px-2 z-50 shadow-[0_-4px_20px_-4px_rgba(0,0,0,0.08)] dark:shadow-[0_-4px_20px_-4px_rgba(0,0,0,0.3)]">
        {mainNavigation.slice(0, 4).map((item) => {
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
        
        {/* Mobile Settings Link to root settings page (or branch by default) */}
        <Link
          href="/settings/branch"
          className={`flex flex-col items-center justify-center gap-1 w-14 h-12 rounded-xl transition-all duration-300 active:scale-95 ${
            pathname.startsWith("/settings")
              ? "text-blue-600 dark:text-blue-400 font-semibold"
              : "text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400"
          }`}
        >
          <div className={`p-1 rounded-lg transition-colors ${pathname.startsWith("/settings") ? "bg-blue-50 dark:bg-blue-900/30" : ""}`}>
            <Settings className="h-5 w-5" />
          </div>
          <span className="text-[10px] tracking-tight">Settings</span>
        </Link>
      </div>
    </>
  );
}
