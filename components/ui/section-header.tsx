import type { ReactNode } from "react";

interface SectionHeaderProps {
  title: string;
  action?: ReactNode;
}

export function SectionHeader({ title, action }: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between px-1 mb-3">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
        {title}
      </h3>
      {action && <div className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors cursor-pointer">{action}</div>}
    </div>
  );
}