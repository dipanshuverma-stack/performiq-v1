"use client";

import * as React from "react";

export type WalletMetricVariant = "success" | "danger" | "info";

interface WalletMetricCardProps {
  title: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  trendIcon: React.ComponentType<{ className?: string }>;
  trendLabel: string;
  variant: WalletMetricVariant;
}

interface StyleConfig {
  border: string;
  iconBg: string;
  badge: string;
}

const variantStyles: Record<WalletMetricVariant, StyleConfig> = {
  success: {
    border: "border-emerald-500/10 hover:border-emerald-500/20",
    iconBg: "bg-emerald-500/10 text-emerald-400",
    badge: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  },
  danger: {
    border: "border-rose-500/10 hover:border-rose-500/20",
    iconBg: "bg-rose-500/10 text-rose-400",
    badge: "bg-rose-500/10 text-rose-400 border-rose-500/20",
  },
  info: {
    border: "border-indigo-500/10 hover:border-indigo-500/20",
    iconBg: "bg-indigo-500/10 text-indigo-400",
    badge: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
  },
};

export function WalletMetricCard({
  title,
  value,
  icon: Icon,
  trendIcon: TrendIcon,
  trendLabel,
  variant,
}: WalletMetricCardProps) {
  const currentStyle = variantStyles[variant];

  return (
    <div className={`
      flex 
      flex-col 
      justify-between 
      rounded-2xl 
      border 
      bg-gradient-to-br 
      from-slate-900/50 
      to-slate-950 
      p-5 
      transition-all 
      duration-200 
      hover:bg-slate-900/80
      ${currentStyle.border}
    `}>
      <div className="flex items-start justify-between w-full">
        <div className="space-y-1.5">
          <p className="text-xs font-medium text-slate-500 tracking-wide">
            {title}
          </p>
          <p className="text-3xl font-bold text-white tracking-tight">
            {value}
          </p>
        </div>

        <div className={`flex h-9 w-9 items-center justify-center rounded-xl border border-transparent ${currentStyle.iconBg}`}>
          <Icon className="h-4.5 w-4.5" />
        </div>
      </div>

      {/* Direct Clean Action Tracking Sub-badge */}
      <div className="mt-5 pt-3 border-t border-slate-900/60 flex items-center">
        <span className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${currentStyle.badge}`}>
          <TrendIcon className="h-3 w-3" />
          <span>{trendLabel}</span>
        </span>
      </div>
    </div>
  );
}