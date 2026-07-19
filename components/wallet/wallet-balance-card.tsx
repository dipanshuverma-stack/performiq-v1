"use client";

import { Wallet, ShieldCheck } from "lucide-react";
import { formatCurrency } from "@/lib/wallet/format";

export interface WalletBalanceCardProps {
  balance: number;
  status?: "active" | "locked";
  monthlyChangeText?: string;
  lastUpdatedText?: string;
}

export function WalletBalanceCard({
  balance,
  status = "active",
  monthlyChangeText,
  lastUpdatedText,
}: WalletBalanceCardProps) {
  const isLocked = status === "locked";

  return (
    <div className="
      relative 
      w-full 
      overflow-hidden 
      rounded-2xl 
      border 
      border-slate-800 
      bg-gradient-to-br 
      from-slate-900 
      via-slate-900/90 
      to-slate-950 
      p-8 
      md:p-10 
      shadow-lg 
      shadow-black/30
    ">
      {/* Background radial layer for clean visual depth */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_120%,rgba(51,65,85,0.15),transparent_60%)] pointer-events-none" />

      {/* Header Context Layout */}
      <div className="flex items-center justify-between relative z-10">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Wallet className="h-4 w-4" />
          </div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
            Reward Wallet
          </p>
        </div>
        
        {/* Dynamic Status Badge */}
        <div className={`
          inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-medium 
          ${isLocked 
            ? "border-amber-500/20 bg-amber-500/5 text-amber-400" 
            : "border-emerald-500/20 bg-emerald-500/5 text-emerald-400"
          }
        `}>
          <span className={`h-1.5 w-1.5 rounded-full ${isLocked ? "bg-amber-400" : "bg-emerald-400"}`} />
          <span className="capitalize">{status}</span>
        </div>
      </div>

      {/* Core Financial Stat Display */}
      <div className="mt-6 flex flex-col sm:flex-row sm:items-baseline sm:gap-4 relative z-10">
        <h2 className="text-5xl font-extrabold tracking-tight text-white sm:text-6xl">
          {formatCurrency(balance)}
        </h2>
        {monthlyChangeText && (
          <span className="text-sm font-semibold text-emerald-400 mt-1 sm:mt-0 tracking-wide">
            {monthlyChangeText}
          </span>
        )}
      </div>

      <p className="mt-3 text-sm text-slate-400 relative z-10">
        Current available wallet balance.
      </p>

      {/* System Audit Footer Tracking */}
      <div className="mt-8 flex items-center justify-between border-t border-slate-800/80 pt-4 text-xs relative z-10">
        <div className="flex items-center gap-1.5 text-slate-500">
          <ShieldCheck className="h-3.5 w-3.5 text-slate-600" />
          <span>Audit Trail Enabled</span>
        </div>
        {lastUpdatedText && (
          <span className="text-slate-500 font-medium">{lastUpdatedText}</span>
        )}
      </div>
    </div>
  );
}