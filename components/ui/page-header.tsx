import type { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  description?: string;
  action?: ReactNode;
}

export function PageHeader({ title, description, action }: PageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-8 border-b border-white/[0.06]">
      <div className="space-y-1">
        <h1 className="text-3xl lg:text-4xl font-bold tracking-tight text-white">
          {title}
        </h1>
        {description && (
          <p className="text-base font-medium text-slate-400">
            {description}
          </p>
        )}
      </div>
      {action && (
        <div className="shrink-0 flex items-center">
          {action}
        </div>
      )}
    </div>
  );
}