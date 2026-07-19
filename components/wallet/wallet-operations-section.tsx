"use client";

import { useState } from "react";
import { WalletTransactionType } from "@prisma/client";
import { PlusCircle, MinusCircle, ArrowRight } from "lucide-react";
import { AdjustWalletDialog } from "./adjust-wallet-dialog";

interface WalletOperationsSectionProps {
  currentBalance: number;
  onAdjustWallet: (
    type: WalletTransactionType,
    amount: number,
    title: string,
    description: string
  ) => Promise<void>;
}

export function WalletOperationsSection({
  currentBalance,
  onAdjustWallet,
}: WalletOperationsSectionProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [transactionType, setTransactionType] = useState<WalletTransactionType>(
    WalletTransactionType.CREDIT
  );

  function openDialog(type: WalletTransactionType) {
    setTransactionType(type);
    setDialogOpen(true);
  }

  async function handleWalletAdjustment(
    type: WalletTransactionType,
    amount: number,
    title: string,
    description: string
  ) {
    await onAdjustWallet(type, amount, title, description);
  }

  return (
    <>
      <section className="space-y-4" aria-label="Wallet Action Operations">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Quick Actions
        </h3>
        
        <div className="grid gap-4 sm:grid-cols-2">
          {/* Credit Allocation Card */}
          <button
            onClick={() => openDialog(WalletTransactionType.CREDIT)}
            className="flex items-center justify-between p-5 rounded-2xl border border-emerald-500/10 bg-gradient-to-br from-slate-900/50 to-slate-950 text-left transition-all duration-200 hover:bg-slate-900/80 hover:border-emerald-500/20 group"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                <PlusCircle className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">Issue Reward Credits</h4>
                <p className="text-xs text-slate-500 mt-0.5">Deposit funds or allocate performance rewards.</p>
              </div>
            </div>
            <ArrowRight className="h-4 w-4 text-slate-600 transition-transform group-hover:translate-x-0.5 group-hover:text-emerald-400" />
          </button>

          {/* Debit Deduction Card */}
          <button
            onClick={() => openDialog(WalletTransactionType.DEBIT)}
            className="flex items-center justify-between p-5 rounded-2xl border border-rose-500/10 bg-gradient-to-br from-slate-900/50 to-slate-950 text-left transition-all duration-200 hover:bg-slate-900/80 hover:border-rose-500/20 group"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500/10 text-rose-400">
                <MinusCircle className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">Deduct Wallet Balance</h4>
                <p className="text-xs text-slate-500 mt-0.5">Revoke tokens, log redemptions, or balance adjust.</p>
              </div>
            </div>
            <ArrowRight className="h-4 w-4 text-slate-600 transition-transform group-hover:translate-x-0.5 group-hover:text-rose-400" />
          </button>
        </div>
      </section>

      <AdjustWalletDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        initialType={transactionType}
        currentBalance={currentBalance}
        onSubmit={handleWalletAdjustment}
      />
    </>
  );
}