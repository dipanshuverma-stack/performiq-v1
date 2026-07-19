"use client";

import { useState, useEffect } from "react";
import { WalletTransactionType } from "@prisma/client";
import { ArrowDownLeft, ArrowUpRight, ArrowRight } from "lucide-react";
import { formatCurrency } from "@/lib/wallet/format";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
} from "../ui/alert-dialog";

import { Button } from "../ui/button";

interface AdjustWalletDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialType: WalletTransactionType;
  currentBalance: number;
  onSubmit: (
    type: WalletTransactionType,
    amount: number,
    title: string,
    description: string
  ) => Promise<void>;
}

export function AdjustWalletDialog({
  open,
  onOpenChange,
  initialType,
  currentBalance,
  onSubmit,
}: AdjustWalletDialogProps) {
  // Semantic State Names
  const [transactionType, setTransactionType] = useState<WalletTransactionType>(initialType);
  const [amount, setAmount] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setTransactionType(initialType);
      setAmount("");
      setTitle("");
      setDescription("");
    }
  }, [open, initialType]);

  async function handleSubmit() {
    try {
      setLoading(true);
      await onSubmit(transactionType, parsedAmount, title, description);
      onOpenChange(false);
    } finally {
      setLoading(false);
    }
  }

  // Derived Clean Math Calculations
  const parsedAmount = Number(amount) || 0;
  const isAmountInvalid = amount !== "" && parsedAmount <= 0;
  
  const delta = transactionType === WalletTransactionType.CREDIT ? parsedAmount : -parsedAmount;
  const balanceAfter = currentBalance + delta;

  const isFormInvalid = 
    !amount || 
    parsedAmount <= 0 || 
    !title.trim() || 
    loading || 
    (transactionType === WalletTransactionType.DEBIT && balanceAfter < 0);

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="sm:max-w-xl border-slate-800 bg-slate-950 p-8 text-white max-h-[90vh] overflow-y-auto">
        
        {/* Header Layout */}
        <AlertDialogHeader className="flex flex-col items-center text-center space-y-3">
          <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${
            transactionType === WalletTransactionType.CREDIT 
              ? "bg-emerald-500/10 text-emerald-400" 
              : "bg-rose-500/10 text-rose-400"
          }`}>
            {transactionType === WalletTransactionType.CREDIT ? (
              <ArrowDownLeft className="h-7 w-7" />
            ) : (
              <ArrowUpRight className="h-7 w-7" />
            )}
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-slate-900 px-2.5 py-0.5 text-xs font-medium text-slate-400 border border-slate-800">
              Reward Wallet
            </div>
            <AlertDialogTitle className="text-2xl font-bold tracking-tight text-white mt-2">
              {transactionType === WalletTransactionType.CREDIT ? "Credit Balance" : "Debit Balance"}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-slate-400 mt-1 max-w-sm">
              {transactionType === WalletTransactionType.CREDIT
                ? "Add reward balance manually. Every transaction is permanently recorded."
                : "Remove reward balance. The audit history cannot be edited."}
            </AlertDialogDescription>
          </div>
        </AlertDialogHeader>

        {/* Form Spaced Layer */}
        <div className="space-y-7 mt-6">
          
          {/* Segmented Cards Selection */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-400">
              Transaction Type
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                disabled={loading}
                onClick={() => setTransactionType(WalletTransactionType.CREDIT)}
                className={`flex items-center justify-center gap-2 rounded-xl border p-4 font-medium transition-all focus:outline-none ${
                  transactionType === WalletTransactionType.CREDIT
                    ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-400"
                    : "border-slate-800 bg-slate-900/50 text-slate-400 hover:bg-slate-900"
                }`}
              >
                <ArrowDownLeft className="h-4 w-4" />
                Credit
              </button>
              <button
                type="button"
                disabled={loading}
                onClick={() => setTransactionType(WalletTransactionType.DEBIT)}
                className={`flex items-center justify-center gap-2 rounded-xl border p-4 font-medium transition-all focus:outline-none ${
                  transactionType === WalletTransactionType.DEBIT
                    ? "border-rose-500/40 bg-rose-500/10 text-rose-400"
                    : "border-slate-800 bg-slate-900/50 text-slate-400 hover:bg-slate-900"
                }`}
              >
                <ArrowUpRight className="h-4 w-4" />
                Debit
              </button>
            </div>
          </div>

          {/* Centered Apple Wallet Layout */}
          <div className="flex flex-col items-center justify-center text-center py-4 border-y border-slate-900">
            <label className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-400 mb-2">
              Reward Amount
            </label>
            <div className="relative flex items-center justify-center max-w-[280px]">
              <span className="text-4xl font-extrabold text-slate-500 mr-2 select-none">₹</span>
              <input
                type="number"
                min={1}
                step={1}
                placeholder="0"
                value={amount}
                disabled={loading}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-transparent text-center text-5xl font-extrabold text-white placeholder:text-slate-800 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
            </div>
            
            {/* Live Inline Helper Context */}
            {parsedAmount > 0 && !isAmountInvalid && (
              <p className={`text-xs mt-2 font-medium tracking-wide ${
                transactionType === WalletTransactionType.CREDIT ? "text-emerald-400" : "text-rose-400"
              }`}>
                {transactionType === WalletTransactionType.CREDIT ? "+" : "—"}{formatCurrency(parsedAmount)} will be {transactionType === WalletTransactionType.CREDIT ? "credited" : "debited"}
              </p>
            )}

            {isAmountInvalid ? (
              <p className="text-xs text-rose-400 mt-2">Amount must be greater than zero.</p>
            ) : (
              transactionType === WalletTransactionType.DEBIT && balanceAfter < 0 && (
                <p className="text-xs text-rose-400 mt-2">Insufficient funds for this transaction.</p>
              )
            )}
          </div>

          {/* Reason Input */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-400">
              Reason
            </label>
            <input
              type="text"
              placeholder="e.g., Monthly Performance Bonus, Manual Reward Adjustment"
              value={title}
              disabled={loading}
              onChange={(e) => setTitle(e.target.value)}
              className="flex h-11 w-full rounded-xl border border-slate-800 bg-slate-900/40 px-4 text-sm text-white placeholder:text-slate-600 focus:border-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>

          {/* Notes Area */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-400">
              Notes (Optional)
            </label>
            <textarea
              placeholder="Optional notes about this adjustment."
              value={description}
              disabled={loading}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="flex w-full rounded-xl border border-slate-800 bg-slate-900/40 p-4 text-sm text-white placeholder:text-slate-600 focus:border-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-800 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
            />
          </div>

          {/* Premium Verification Ledger Card */}
          <div className="rounded-xl border border-slate-900 bg-slate-950 p-5 space-y-4 shadow-inner">
            <div className="flex items-center justify-between border-b border-slate-900 pb-3">
              <span className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-400">Live Balance Impact</span>
              <span className="text-xs text-slate-500 truncate max-w-[200px]">{title.trim() ? title : "No reason provided"}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-xs text-slate-500 uppercase tracking-wider">Current</span>
                <span className="text-lg font-bold text-slate-300">{formatCurrency(currentBalance)}</span>
              </div>
              
              {/* Central Math Block Signifier */}
              <div className="flex flex-col items-center justify-center bg-slate-900 px-3 py-1 rounded-lg border border-slate-800 min-w-[70px]">
                <span className={`text-xs font-bold ${transactionType === WalletTransactionType.CREDIT ? "text-emerald-400" : "text-rose-400"}`}>
                  {transactionType === WalletTransactionType.CREDIT ? "+" : ""}{delta !== 0 ? formatCurrency(delta) : formatCurrency(0)}
                </span>
              </div>
              
              <div className="flex flex-col text-right">
                <span className="text-xs text-slate-500 uppercase tracking-wider">
                  {transactionType === WalletTransactionType.CREDIT ? "After Credit" : "After Debit"}
                </span>
                <span className={`text-xl font-extrabold transition-all duration-200 ${
                  transactionType === WalletTransactionType.CREDIT ? "text-emerald-400" : balanceAfter < 0 ? "text-rose-500" : "text-rose-400"
                }`}>
                  {formatCurrency(balanceAfter)}
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <AlertDialogFooter className="mt-8 flex gap-3 sm:space-x-0">
          <Button
            variant="outline"
            disabled={loading}
            onClick={() => onOpenChange(false)}
            className="border-slate-800 bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white rounded-xl h-11 px-6 font-medium transition-all"
          >
            Back
          </Button>

          <Button 
            onClick={handleSubmit} 
            disabled={isFormInvalid}
            className={`flex-1 rounded-xl h-11 px-5 font-semibold tracking-wide transition-all ${
              transactionType === WalletTransactionType.CREDIT
                ? "bg-emerald-600 text-white hover:bg-emerald-500 disabled:bg-slate-900 disabled:text-slate-700"
                : "bg-rose-600 text-white hover:bg-rose-500 disabled:bg-slate-900 disabled:text-slate-700"
            }`}
          >
            {loading ? (
              transactionType === WalletTransactionType.CREDIT ? "Crediting Wallet..." : "Debiting Wallet..."
            ) : (
              transactionType === WalletTransactionType.CREDIT ? "Credit Wallet" : "Debit Wallet"
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}