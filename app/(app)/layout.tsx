"use client";

import { useState } from "react";
import { SmartLink as Link } from "@/components/smart-link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { PageContainer } from "@/components/layout/page-container";
import { Menu, X } from "lucide-react";
import { navigationGroups } from "@/lib/navigation";
import { user } from "@/lib/user";
import { appConfig } from "@/lib/app-config";
import { getInitials } from "@/lib/formatters";
import { widePages } from "@/lib/page-layouts";

export default function AppLayout({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const closeSidebar = () => setIsOpen(false);

  // Logic for page container size
  const isWidePage = widePages.some(
    (page) => pathname === page || pathname.startsWith(`${page}/`)
  );
  const containerSize = isWidePage ? "wide" : "default";

  return (
    // FIXED: Removed dark variant, applied core background color directly
    <div className="min-h-screen flex bg-[#090D16] text-slate-200 transition-colors duration-200">
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden" 
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-[#0B0F19] text-slate-200 flex flex-col border-r border-white/[0.06] shrink-0 select-none
        transform transition-transform duration-300 ease-in-out md:translate-x-0
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        {/* ... (Sidebar content remains same) */}
        <div className="p-6 border-b border-white/[0.06] flex justify-between items-center">
          <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-indigo-500" />
            {appConfig.name}
          </h1>
          <button onClick={closeSidebar} aria-label="Close menu" className="md:hidden text-slate-400">
            <X className="h-6 w-6" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-hidden">
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
                        className={`group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors duration-200 ${
                          isActive 
                            ? "bg-indigo-500/10 text-indigo-400 before:absolute before:left-0 before:top-2.5 before:bottom-2.5 before:w-[2px] before:bg-indigo-500 before:rounded-full" 
                            : "text-slate-400 hover:bg-white/[0.05] hover:text-slate-100"
                        }`}
                      >
                        <Icon className="h-4 w-4 shrink-0" />
                        {item.name}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>
        {/* ... (Footer content remains same) */}
      </aside>

      {/* Main Content */}
      {/* FIXED: Removed dark variant, applied core background color directly */}
      <main className="md:ml-64 flex-1 flex flex-col min-w-0 overflow-x-hidden bg-[#090D16] transition-colors duration-300">
        <header className="md:hidden p-4 border-b border-white/[0.06] flex items-center justify-between">
            <button onClick={() => setIsOpen(true)} className="p-2 hover:bg-white/[0.04] rounded-lg text-white">
              <Menu className="h-6 w-6" />
            </button>
            <h1 className="font-bold text-lg text-white">{appConfig.name}</h1>
        </header>

        <div className="flex-1">
          {/* Passed the correctly evaluated containerSize */}
          <PageContainer size={containerSize}>
            {children}
          </PageContainer>
        </div>
      </main>
    </div>
  );
}