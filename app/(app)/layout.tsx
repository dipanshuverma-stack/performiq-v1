"use client";

import { useState } from "react";
import { SmartLink as Link } from "@/components/smart-link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { 
  Menu, X, LayoutDashboard, BookOpen, CheckSquare, RotateCcw, 
  Timer, BarChart3, GraduationCap, FileWarning,
  Calendar, Bot, Sparkles, TrendingUp, LineChart,
  Bell, User, Settings 
} from "lucide-react";

// Example location where the navigation structure is declared
const navigationGroups = [
  {
    title: "Core",
    items: [
      { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      { name: "Syllabus Tracker", href: "/syllabus", icon: BookOpen },
    ],
  },
  {
    title: "Practice",
    items: [
      { name: "Practice Timer", href: "/practice", icon: Timer },
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
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const closeSidebar = () => setIsOpen(false);

  return (
    <div className="min-h-screen flex bg-gray-50 text-gray-900">
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden" 
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar - Drawer on Mobile, Fixed on Desktop */}
      <aside className={`
        fixed md:relative z-50 w-64 h-screen md:h-auto bg-slate-950 text-slate-200 flex flex-col border-r border-slate-800 shrink-0 select-none
        transform transition-transform duration-300 ease-in-out md:translate-x-0
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        <div className="p-6 border-b border-slate-900 flex justify-between items-center">
          <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            PerformIQ
          </h1>
          <button 
            onClick={closeSidebar} 
            aria-label="Close menu"
            className="md:hidden text-slate-400"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
          {navigationGroups.map((section) => (
            <div key={section.title} className="space-y-1">
              <h2 className="px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                {section.title}
              </h2>
              <ul className="space-y-0.5">
                {section.items.map((item) => {
                  const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                  const Icon = item.icon;
                  
                  return (
                    <li key={item.href}>
                      <Link 
                        href={item.href} 
                        onClick={closeSidebar}
                        prefetch={false} // <-- FIX: Stops Next.js from spamming compilation requests for all 17 pages at once
                        className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                          isActive 
                            ? "bg-emerald-500/10 text-emerald-400" 
                            : "text-slate-400 hover:bg-slate-900"
                        }`}
                      >
                        <Icon className="h-4 w-4" />
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

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        <header className="md:hidden p-4 border-b bg-white flex items-center">
          <button onClick={() => setIsOpen(true)} className="mr-4 p-2 hover:bg-gray-100 rounded-lg">
            <Menu className="h-6 w-6" />
          </button>
          <h1 className="font-bold text-lg">PerformIQ</h1>
        </header>

        {children}
      </main>
    </div>
  );
}