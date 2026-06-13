import React, { ReactNode } from "react";

interface SidebarSectionProps {
  title: string;
  children: ReactNode;
}

export function SidebarSection({ title, children }: SidebarSectionProps) {
  return (
    <div className="space-y-1">
      <h2 className="px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500 select-none">
        {title}
      </h2>
      <ul className="space-y-0.5">
        {children}
      </ul>
    </div>
  );
}