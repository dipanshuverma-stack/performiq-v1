"use client";

import { Vault, ShieldCheck } from "lucide-react";

export function WalletHero() {
  return (
    <section 
      aria-labelledby="wallet-hero-title"
      className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between border-b border-slate-900 pb-8"
    >
      {/* Left Core: Intent & System State */}
      <div className="flex flex-col items-start space-y-4 max-w-xl">
        <div className="flex flex-col space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            REWARD WALLET
          </p>
          <h1 
            id="wallet-hero-title"
            className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl"
          >
            Reward Wallet
          </h1>
          <p className="text-sm text-slate-400 leading-relaxed mt-1">
            Monitor your balance, transaction history, and every reward earned throughout your preparation.
          </p>
        </div>

        {/* Calm Visual Ledger Status (Static Indicator) */}
        <div 
          className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1"
          role="status"
          aria-label="System status: Ledger Active"
        >
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
          <span className="text-xs font-medium text-emerald-300 tracking-wide">
            Ledger Active
          </span>
        </div>
      </div>

      {/* Right Core: Identity Representation */}
      <WalletIdentityCard />
    </section>
  );
}

/**
 * Isolated Identity Card Component
 * Designed to cleanly scale for future metrics like available balance or sync status.
 */
function WalletIdentityCard() {
  return (
    <div 
      aria-hidden="true"
      className="
        group
        relative
        flex
        w-full
        min-w-[250px]
        flex-col
        items-center
        justify-center
        rounded-2xl
        border
        border-amber-500/15
        bg-gradient-to-br
        from-slate-900/60
        to-slate-950
        p-6
        text-center
        shadow-lg
        shadow-black/20
        transition-all
        duration-300
        hover:border-amber-500/25
        md:w-auto
      "
    >
      {/* Hero Visual Token Container - vault icon conveys ultimate security */}
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-amber-500/20 bg-amber-500/10 text-amber-400 shadow-inner group-hover:bg-amber-500/20 transition-colors duration-300">
        <Vault className="h-7 w-7" />
      </div>

      {/* Identity Meta Block */}
      <div className="mt-4 space-y-1">
        <p className="text-sm font-bold text-white tracking-wide">
          PerformIQ Wallet
        </p>
        <div className="flex items-center justify-center gap-1 text-xs font-medium text-slate-500 group-hover:text-amber-400/80 transition-colors duration-300">
          <ShieldCheck className="h-3.5 w-3.5" />
          <span>Secure Ledger</span>
        </div>
        <p className="text-[10px] font-medium uppercase tracking-wider text-slate-600 group-hover:text-slate-500 transition-colors duration-300 pt-1">
          Financial Audit Trail
        </p>
      </div>
    </div>
  );
}