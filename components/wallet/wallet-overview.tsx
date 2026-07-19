"use client";

import { ArrowDownLeft, ArrowUpRight, ReceiptText, ArrowUp, ArrowDown, FileText } from "lucide-react";
import { formatCurrency } from "@/lib/wallet/format";
import { WalletBalanceCard } from "./wallet-balance-card";
import { WalletMetricCard } from "./wallet-metric-card";

interface WalletOverviewProps {
  balance: number;
  earned: number;
  spent: number;
  transactions: number;
  status?: "active" | "locked";
  monthlyChangeText?: string;
  lastUpdatedText?: string;
}

export function WalletOverview({
  balance,
  earned,
  spent,
  transactions,
  status = "active",
  monthlyChangeText,
  lastUpdatedText,
}: WalletOverviewProps) {
  return (
    <section className="space-y-5" aria-label="Wallet Financial Overview">
      {/* High Fidelity Balance Focal Point */}
      <WalletBalanceCard 
        balance={balance} 
        status={status}
        monthlyChangeText={monthlyChangeText} 
        lastUpdatedText={lastUpdatedText}
      />

      {/* Structural Metric Analytics Assembly */}
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3" role="group" aria-label="Ledger Statistics">
        <WalletMetricCard
          title="Lifetime Earned"
          value={formatCurrency(earned)}
          icon={ArrowDownLeft}
          trendIcon={ArrowUp}
          trendLabel="Credits"
          variant="success"
        />
        <WalletMetricCard
          title="Lifetime Debited"
          value={formatCurrency(spent)}
          icon={ArrowUpRight}
          trendIcon={ArrowDown}
          trendLabel="Debits"
          variant="danger"
        />
        <WalletMetricCard
          title="Ledger Entries"
          value={transactions.toLocaleString()}
          icon={ReceiptText}
          trendIcon={FileText}
          trendLabel="Ledger"
          variant="info"
        />
      </div>
    </section>
  );
}