import type { ReactNode, HTMLAttributes } from "react";

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function GlassCard({ children, className = "", ...props }: GlassCardProps) {
  return (
    <div
      className={`
        relative
        overflow-hidden
        rounded-2xl
        border border-white/[0.08]
        bg-white/[0.03]
        backdrop-blur-xl
        transition-all
        duration-200
        ${className}
      `}
      {...props}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent pointer-events-none" />
      <div className="relative z-10 w-full h-full">
        {children}
      </div>
    </div>
  );
}