"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

// Hook up Lucide icons for a more polished look
import { 
  LayoutDashboard, BookOpen, CheckSquare, RotateCcw, 
  Timer, History, BarChart3, GraduationCap, FileWarning,
  Calendar, Bot, Sparkles, TrendingUp, LineChart,
  Bell, User, Settings 
} from "lucide-react";

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const navigation: NavSection[] = [
  {
    title: "Study",
    items: [
      { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      { name: "Syllabus", href: "/syllabus", icon: BookOpen },
      { name: "Tasks", href: "/tasks", icon: CheckSquare },
      { name: "Revision", href: "/revision", icon: RotateCcw },
    ],
  },
  {
    title: "Practice",
    items: [
      { name: "Practice Timer", href: "/practice", icon: Timer },
      { name: "Practice History", href: "/practice/history", icon: History },
      { name: "Practice Analytics", href: "/practice/analytics", icon: BarChart3 },
      { name: "Mock Tests", href: "/mocks", icon: GraduationCap },
      { name: "Mistake Journal", href: "/mistakes", icon: FileWarning },
    ],
  },
  {
    title: "Intelligence",
    items: [
      { name: "Daily Plan", href: "/daily-plan", icon: Calendar },
      { name: "Study Coach", href: "/coach", icon: Bot },
      { name: "Smart Revision", href: "/revision/intelligence", icon: Sparkles },
    ],
  },
  {
    title: "Insights",
    items: [
      { name: "Progress", href: "/progress", icon: TrendingUp },
      { name: "Analytics", href: "/analytics", icon: LineChart },
    ],
  },
  {
    title: "Account",
    items: [
      { name: "Notifications", href: "/notifications", icon: Bell },
      { name: "Profile", href: "/profile", icon: User },
      { name: "Settings", href: "/settings", icon: Settings },
    ],
  },
];

export default function AppLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen flex bg-gray-50 text-gray-900">
      {/* Sidebar Container */}
      <aside className="w-64 bg-slate-950 text-slate-200 flex flex-col border-r border-slate-800 shrink-0 select-none">
        {/* Header / Brand */}
        <div className="p-6 border-b border-slate-900">
          <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            PerformIQ
          </h1>
        </div>

        {/* Navigation Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
          {navigation.map((section) => (
            <div key={section.title} className="space-y-1">
              <h2 className="px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                {section.title}
              </h2>

              <ul className="space-y-0.5">
                {section.items.map((item) => {
                  const isActive = pathname === item.href;
                  const Icon = item.icon;

                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        prefetch={false}
                        className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 group ${
                          isActive
                            ? "bg-emerald-500/10 text-emerald-400 font-semibold"
                            : "text-slate-400 hover:bg-slate-900 hover:text-slate-100"
                        }`}
                      >
                        <Icon 
                          className={`h-4 w-4 shrink-0 transition-transform duration-200 group-hover:scale-105 ${
                            isActive ? "text-emerald-400" : "text-slate-400 group-hover:text-slate-200"
                          }`} 
                        />
                        {item.name}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>
      </aside>

      {/* Primary Workspace View */}
      <main className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        {children}
      </main>
    </div>
  );
}