import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

interface EmptyStateProps {
  title: string;
  description: string;
  icon: LucideIcon;
  action?: ReactNode;
}

export function EmptyState({ title, description, icon: Icon, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 rounded-2xl border border-dashed border-white/[0.08] bg-white/[0.01] min-h-[220px]">
      <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.06] text-slate-400 mb-4">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="text-sm font-semibold text-slate-200">{title}</h3>
      <p className="text-xs text-slate-500 max-w-xs mt-1 mb-5">
        {description}
      </p>
      {action && <div className="w-full flex justify-center">{action}</div>}
    </div>
  );
}