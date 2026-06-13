import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PageContainerProps {
  children: ReactNode;
  className?: string;
  size?: "default" | "wide";
}

export function PageContainer({
  children,
  className,
  size = "default",
}: PageContainerProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full px-6 py-8",
        size === "wide" ? "max-w-screen-2xl" : "max-w-7xl",
        className
      )}
    >
      {children}
    </div>
  );
}