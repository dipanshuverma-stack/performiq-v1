import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  glow?: boolean;
}

export function GlassCard({
  children,
  className,
  glow = false,
}: GlassCardProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-3xl",
        "border border-white/[0.08]",
        "bg-[#0E121B]",
        "backdrop-blur-xl",
        "transition-all duration-300",
        className
      )}
    >
      {/* top highlight */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-white/[0.06]" />

      {/* ambient glow */}
      {glow && (
        <>
          <div className="pointer-events-none absolute -right-24 -top-16 h-72 w-72 rounded-full bg-indigo-500/[0.04] blur-3xl" />

          <div className="pointer-events-none absolute inset-0 bg-gradient-to-l from-indigo-500/[0.03] via-transparent to-transparent" />
        </>
      )}

      {/* content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}