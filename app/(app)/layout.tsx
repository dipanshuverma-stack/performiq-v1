"use client";

import { useState, useCallback } from "react";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { SmartLink as Link } from "@/components/smart-link";
import { PageContainer } from "@/components/layout/page-container";
import { Menu, X } from "lucide-react";

import { navigationGroups } from "@/lib/navigation";
import { appConfig } from "@/lib/app-config";
import { widePages } from "@/lib/page-layouts";
import { Footer } from "@/components/ui/Footer";
import { AchievementProvider } from "@/components/achievements/achievement-provider";
import AchievementToastHost from "@/components/achievements/achievement-toast-host";

export default function AppLayout({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const closeSidebar = useCallback(() => setIsOpen(false), []);

  const isWidePage = widePages.some(
    (page) => pathname === page || pathname.startsWith(`${page}/`)
  );
  const containerSize = isWidePage ? "wide" : "default";

  return (
    <AchievementProvider>
      <div className="min-h-screen flex bg-[#090D16] text-slate-200">
        {/* Mobile Backdrop */}
        {isOpen && (
          <div
            className="fixed inset-0 bg-black/70 z-40 md:hidden backdrop-blur-sm"
            onClick={closeSidebar}
            aria-hidden="true"
          />
        )}

        {/* Sidebar */}
        <aside
          className={`
            fixed inset-y-0 left-0 z-50 w-64 bg-[#0B0F19] flex flex-col border-r border-white/[0.06] shrink-0
            transform transition-transform duration-300 ease-out md:translate-x-0 md:static
            ${isOpen ? "translate-x-0" : "-translate-x-full"}
          `}
        >
          <div className="p-6 border-b border-white/[0.06] flex justify-between items-center">
            <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-indigo-500" />
              {appConfig.name}
            </h1>
            <button
              onClick={closeSidebar}
              className="md:hidden text-slate-400 hover:text-white p-1"
              aria-label="Close menu"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-thin scrollbar-thumb-white/10">
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
                          className={`group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                            isActive
                              ? "bg-indigo-500/10 text-indigo-400 before:absolute before:left-0 before:top-2.5 before:bottom-2.5 before:w-[3px] before:bg-indigo-500"
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
        </aside>

        {/* Main Content */}
        <main className="md:ml-10 flex-1 flex flex-col min-w-0 overflow-x-hidden">
          {/* Mobile Header */}
          <header className="md:hidden p-4 border-b border-white/[0.06] flex items-center justify-between bg-[#090D16] sticky top-0 z-30">
            <button
              onClick={() => setIsOpen(true)}
              className="p-2 hover:bg-white/[0.05] rounded-lg text-white transition-colors"
              aria-label="Open menu"
            >
              <Menu className="h-6 w-6" />
            </button>
            <h1 className="font-bold text-lg text-white">{appConfig.name}</h1>
          </header>

          {/* Page Content */}
          <div className="flex-1 pt-0 md:pt-0">
            <PageContainer size={containerSize} className="pt-6 md:pt-8">
              {children}
            </PageContainer>
          </div>

          <Footer />
        </main>

        <AchievementToastHost />
      </div>
    </AchievementProvider>
  );
}