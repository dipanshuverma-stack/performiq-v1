import type { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  description?: string;
  action?: ReactNode;
}

export function PageHeader({ title, description, action }: PageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-200 dark:border-white/[0.06]">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
          {title}
        </h1>
        {description && (
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
            {description}
          </p>
        )}
      </div>
      {action && <div className="shrink-0 flex items-center">{action}</div>}
    </div>
  );
}