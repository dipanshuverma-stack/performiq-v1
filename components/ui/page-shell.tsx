import React from "react";
import { cn } from "@/lib/utils";

interface PageShellProps {
  children: React.ReactNode;
  className?: string;
}

export function PageShell({ children, className }: PageShellProps) {
  return (
    <div className={cn("min-h-screen flex bg-[#090D16]", className)}>
      <main className="flex-1 overflow-y-auto">
        {/* PageShell dictates vertical layout and vertical rhythm */}
        <div className="space-y-8 py-6">
          {children}
        </div>
      </main>
    </div>
  );
}