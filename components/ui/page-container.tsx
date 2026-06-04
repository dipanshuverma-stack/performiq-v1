import React from "react";

interface PageContainerProps {
  children: React.ReactNode;
  size?: "default" | "wide" | "reading";
}

export function PageContainer({
  children,
  size = "default",
}: PageContainerProps) {
  const layouts = {
    default: "max-w-7xl px-6 py-6",
    /* Premium Grid Spacing: Clean on mobile (16px), spacious and expansive on wide desktops (32px) */
    wide: "max-w-none px-4 py-6 lg:px-8", 
    reading: "max-w-5xl px-6 py-6",
  };

  return (
    <div className={`mx-auto w-full ${layouts[size]}`}>
      {children}
    </div>
  );
}