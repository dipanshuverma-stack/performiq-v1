import { PageContainer } from "@/components/layout/page-container";
import { WalletHero } from "@/components/wallet/wallet-header";
import { WalletOverview } from "@/components/wallet/wallet-overview";
import { WalletOperationsSection } from "@/components/wallet/wallet-operations-section";
import { WalletLedger } from "@/components/wallet/wallet-ledger";
import { getWallet, adjustWallet } from "./actions";

export default async function WalletPage() {
  const data = await getWallet();

  // Redirect or render fallback state if user session context is completely absent
  if (!data) {
    return null;
  }

  // De-duplicate empty schema records into a safe presentation default
  const wallet = data.wallet ?? {
    balance: 0,
    totalEarned: 0,
    totalSpent: 0,
  };

  return (
    <PageContainer>
      <div className="space-y-10">
        {/* Module Layout Header */}
        <WalletHero />

        {/* Global Structural Metric Aggregates */}
        <WalletOverview
          balance={wallet.balance}
          earned={wallet.totalEarned}
          spent={wallet.totalSpent}
          transactions={data.transactions.length}
        />

        {/* Dynamic Authorization and Operational Flow Actions */}
        <WalletOperationsSection
          currentBalance={wallet.balance}
          onAdjustWallet={adjustWallet}
        />

        {/* Chronological Audit Log History Matrix */}
        <WalletLedger
          transactions={data.transactions}
        />
      </div>
    </PageContainer>
  );
}