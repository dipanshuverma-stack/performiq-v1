import React, { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
}

export function GlassCard({ children, className }: GlassCardProps) {
  return (
    <div 
      className={cn(
        "relative overflow-hidden rounded-2xl border border-border bg-card/50 backdrop-blur-xl shadow-sm",
        className
      )}
    >
      {/* Optional: A subtle gradient shine effect on the top edge */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      
      {children}
    </div>
  );
}