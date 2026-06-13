import React from "react";

interface PageShellProps {
  children: React.ReactNode;
}

export function PageShell({ children }: PageShellProps) {
  return (
    /* PageShell only dictates vertical layout spacing down its child tree */
    <div className="space-y-8 py-6">
      {children}
    </div>
  );
}