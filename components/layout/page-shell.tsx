"use client";

import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

import { AppSidebar } from "@/components/layout/app-sidebar";
import { AppFooter } from "@/components/layout/app-footer";

interface PageShellProps {
  children: ReactNode;
  className?: string;
}

export function PageShell({
  children,
  className,
}: PageShellProps) {
  return (
    <div className="min-h-screen bg-[#090D16] flex">
      {/* Sidebar */}

      <aside className="hidden lg:flex w-64 shrink-0 border-r border-white/5 bg-[#0B0F19]">
        <AppSidebar />
      </aside>

      {/* Main Workspace */}

      <div className="flex flex-1 flex-col min-w-0">
        {/* Scrollable Content */}

        <main
          className={cn(
            "flex-1 overflow-y-auto",
            className
          )}
        >
          {children}
        </main>

        {/* Footer */}

        <AppFooter />
      </div>
    </div>
  );
}