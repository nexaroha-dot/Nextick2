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

  return (
    <div className="flex h-full w-64 flex-col border-r bg-gray-50/40 dark:bg-gray-800/40">
      <div className="flex h-14 items-center px-4 lg:h-[60px] lg:px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <span className="text-lg tracking-tight">Next Sheet</span>
        </Link>
      </div>
      <div className="flex-1 overflow-auto py-2">
        <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
          {navigation.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${
                  isActive
                    ? "bg-muted text-primary bg-gray-100 dark:bg-gray-800 font-semibold"
                    : "text-muted-foreground text-gray-600 dark:text-gray-400"
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
