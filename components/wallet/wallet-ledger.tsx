"use client";

import { WalletTransaction, WalletTransactionType } from "@prisma/client";
import { format, isToday, isYesterday } from "date-fns";
import { ArrowDownLeft, ArrowUpRight, Coins, Search, SlidersHorizontal } from "lucide-react";
import { formatCurrency } from "@/lib/wallet/format";

interface WalletLedgerProps {
  transactions: WalletTransaction[];
}

// Group transactions chronologically by clear human-readable target labels
function groupTransactionsByDate(transactions: WalletTransaction[]) {
  return transactions.reduce<Record<string, WalletTransaction[]>>((groups, tx) => {
    const date = new Date(tx.createdAt);
    let dateLabel = format(date, "dd MMMM yyyy");

    if (isToday(date)) {
      dateLabel = "Today";
    } else if (isYesterday(date)) {
      dateLabel = "Yesterday";
    }

    if (!groups[dateLabel]) {
      groups[dateLabel] = [];
    }
    groups[dateLabel].push(tx);
    return groups;
  }, {});
}

export function WalletLedger({ transactions }: WalletLedgerProps) {
  const groupedTransactions = groupTransactionsByDate(transactions);
  const totalEntries = transactions.length;

  return (
    <section className="space-y-4" aria-label="Transactional History Record">
      {/* Dynamic Summary Header */}
      <div className="flex items-baseline justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
            Audit Ledger
          </p>
          <h2 className="mt-1.5 text-2xl font-bold tracking-tight text-white">
            Wallet Ledger
          </h2>
        </div>
        <div className="text-xs font-semibold text-slate-400 bg-slate-900 px-3 py-1 rounded-full border border-slate-800">
          {totalEntries} {totalEntries === 1 ? "Entry" : "Entries"}
        </div>
      </div>

      {/* Search & Filter Scaffolding Container */}
      <div className="flex gap-2 w-full">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-600" />
          <input 
            type="text" 
            placeholder="Search transactions..." 
            disabled
            className="w-full h-9 pl-9 pr-4 rounded-xl border border-slate-800/80 bg-slate-950 text-xs text-slate-400 placeholder-slate-600 focus:outline-none opacity-60 cursor-not-allowed"
          />
        </div>
        <button 
          disabled 
          className="flex h-9 items-center gap-1.5 px-3 rounded-xl border border-slate-800/80 bg-slate-950 text-xs text-slate-500 font-medium opacity-60 cursor-not-allowed"
        >
          <SlidersHorizontal className="h-3.5 w-3.5" />
          <span>Filter</span>
        </button>
      </div>

      {/* Main Container Layer */}
      <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 shadow-lg shadow-black/20">
        {totalEntries === 0 ? (
          /* Premium Structural Empty State */
          <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 border border-slate-800 text-slate-500 mb-4 shadow-inner">
              <Coins className="h-6 w-6" />
            </div>
            <h3 className="text-sm font-semibold text-slate-200">No wallet activity yet</h3>
            <p className="mt-1.5 max-w-sm text-xs text-slate-500 leading-relaxed">
              Reward transactions will appear here systematically as you earn, spend, or manually adjust your wallet balance.
            </p>
          </div>
        ) : (
          /* Grouped Financial Ledger Entries List */
          <div className="divide-y divide-slate-900">
            {Object.entries(groupedTransactions).map(([dateLabel, items]) => (
              <div key={dateLabel} className="bg-slate-950">
                {/* Visual Date Separator Heading Row */}
                <div className="sticky top-0 z-10 bg-slate-900/40 backdrop-blur-md border-y border-slate-900 px-5 py-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    {dateLabel}
                  </span>
                </div>

                {/* Local Rows Matrix Mapping */}
                <div className="divide-y divide-slate-900/60">
                  {items.map((transaction) => {
                    const isCredit = transaction.type === WalletTransactionType.CREDIT;

                    return (
                      <div
                        key={transaction.id}
                        className="flex items-center justify-between p-5 transition-colors duration-150 hover:bg-slate-900/50"
                      >
                        {/* Column Left: Descriptor Meta Group */}
                        <div className="flex items-center gap-4 min-w-0">
                          <div className={`
                            flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border
                            ${isCredit 
                              ? "bg-emerald-500/5 text-emerald-400 border-emerald-500/10" 
                              : "bg-rose-500/5 text-rose-400 border-rose-500/10"
                            }
                          `}>
                            {isCredit ? (
                              <ArrowDownLeft className="h-5 w-5" />
                            ) : (
                              <ArrowUpRight className="h-5 w-5" />
                            )}
                          </div>

                          <div className="min-w-0 space-y-0.5">
                            <div className="flex flex-wrap items-center gap-2">
                              <h4 className="text-sm font-semibold tracking-tight text-white truncate">
                                {transaction.title}
                              </h4>
                              {/* Source Metadata Pill */}
                              <span className="inline-flex items-center rounded bg-slate-900 px-1.5 py-0.5 text-[10px] font-medium text-slate-400 border border-slate-800">
                                {transaction.source}
                              </span>
                              {/* Expressive Allocation Ledger Tag */}
                              <span className={`
                                inline-flex items-center px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide rounded border
                                ${isCredit 
                                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/10" 
                                  : "bg-rose-500/10 text-rose-400 border-rose-500/10"
                                }
                              `}>
                                {isCredit ? "Credit" : "Debit"}
                              </span>
                            </div>

                            <p className="text-xs text-slate-500 truncate max-w-md">
                              {transaction.description || "No transactional breakdown note provided."}
                            </p>

                            <p className="text-[10px] font-medium text-slate-600">
                              {format(new Date(transaction.createdAt), "hh:mm a")}
                            </p>
                          </div>
                        </div>

                        {/* Column Right: Strict Currency Delta and Running Balance Alignments */}
                        <div className="text-right shrink-0 pl-4 space-y-1">
                          <div className={`text-base font-bold tracking-tight ${isCredit ? "text-emerald-400" : "text-rose-400"}`}>
                            {isCredit ? "+ " : "- "}
                            {formatCurrency(transaction.amount)}
                          </div>

                          <div className="text-[10px] text-slate-500 flex flex-col sm:block">
                            <span className="text-slate-600 font-medium sm:mr-1">After Balance</span>
                            <span className="font-semibold text-slate-400">{formatCurrency(transaction.balanceAfter)}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}