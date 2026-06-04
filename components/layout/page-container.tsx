import React from "react";

interface PageContainerProps {
  children: React.ReactNode;
  size?: "default" | "wide" | "reading";
}

export function PageContainer({ children, size = "default" }: PageContainerProps) {
  const layouts = {
    default: "max-w-7xl",
    wide: "max-w-none",
    reading: "max-w-5xl",
  };

  return (
    // Hardcoded padding: 16px mobile, 24px desktop (lg:px-6)
    <div className={`mx-auto w-full px-4 lg:px-6 py-6 ${layouts[size]}`}>
      {children}
    </div>
  );
}