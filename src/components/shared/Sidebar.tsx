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
  User as UserIcon
} from "lucide-react";
import { logoutUser } from "@/actions/auth";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Tick Sheet", href: "/tick-sheet", icon: CheckSquare },
  { name: "Forms", href: "/forms", icon: FileText },
  { name: "Create", href: "/create", icon: PlusSquare },
  { name: "Reports", href: "/reports", icon: BarChart3 },
  { name: "Storage", href: "/storage", icon: Database },
  { name: "Settings", href: "/settings", icon: Settings },
];

export default function Sidebar({ session }: { session: any }) {
  const pathname = usePathname();
  const [showMobileProfile, setShowMobileProfile] = useState(false);

  // Optimized list of 4 main items + Profile for the mobile bottom navigation bar
  const mobileNavigation = [
    navigation[0], // Dashboard
    navigation[1], // Tick Sheet
    navigation[2], // Forms
    navigation[3], // Create
  ];

  const handleLogout = async () => {
    await logoutUser();
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:flex h-full w-64 flex-col border-r border-slate-200/50 dark:border-slate-800/50 glass z-10 relative bg-white/50 dark:bg-slate-900/50">
        <div className="flex h-16 shrink-0 items-center px-6 border-b border-slate-200/50 dark:border-slate-800/50">
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

        {/* Desktop User Profile Bottom Section */}
        {session && (
          <div className="shrink-0 p-4 border-t border-slate-200/50 dark:border-slate-800/50">
            <div className="flex items-center gap-3 bg-white/60 dark:bg-slate-800/60 p-3 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700/50">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center text-white shrink-0 shadow-md">
                <span className="font-bold text-sm">{session.username.charAt(0).toUpperCase()}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-800 dark:text-slate-100 truncate">
                  {session.username}
                </p>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 truncate">
                  {session.role}
                </p>
              </div>
              <button 
                onClick={handleLogout}
                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors"
                title="Log out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
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

        {/* Mobile Profile Toggle */}
        <button
          onClick={() => setShowMobileProfile(!showMobileProfile)}
          className={`flex flex-col items-center justify-center gap-1 w-14 h-12 rounded-xl transition-all duration-300 active:scale-95 ${
            showMobileProfile
              ? "text-blue-600 dark:text-blue-400 font-semibold"
              : "text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400"
          }`}
        >
          <div className={`p-1 rounded-lg transition-colors ${showMobileProfile ? "bg-blue-50 dark:bg-blue-900/30" : ""}`}>
            <UserIcon className="h-5 w-5" />
          </div>
          <span className="text-[10px] tracking-tight">Profile</span>
        </button>
      </div>

      {/* Mobile Profile Slide-Up Menu */}
      {showMobileProfile && session && (
        <div className="md:hidden fixed bottom-16 left-0 right-0 p-4 z-40 animate-in slide-in-from-bottom-4 duration-200">
          <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/50 rounded-2xl p-4 shadow-xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center text-white shadow-md">
                <span className="font-bold">{session.username.charAt(0).toUpperCase()}</span>
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800 dark:text-slate-100">{session.username}</p>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{session.role}</p>
              </div>
            </div>
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 rounded-xl font-bold text-sm hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      )}
    </>
  );
}
