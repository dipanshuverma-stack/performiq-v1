import Link from "next/link";
import { Trophy, Wallet2 } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";

type ProgressSectionProps = {
  wallet: {
    balance: number;
  };
};

export function ProgressSection({ wallet }: ProgressSectionProps) {
  return (
    <section aria-labelledby="progress-section" className="space-y-4">
      <h2
        id="progress-section"
        className="text-sm font-semibold uppercase tracking-wider text-muted-foreground"
      >
        Progress
      </h2>

      <div className="grid gap-4 md:grid-cols-2">
        <Link href="/achievements" className="block group">
          <GlassCard className="p-6 hover:border-blue-500/40">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-xl text-white group-hover:text-blue-400 transition-colors">
                  Achievements
                </h3>
                <p className="mt-1.5 text-sm text-muted-foreground">
                  View milestones and unlocked badges
                </p>
              </div>
              <Trophy className="h-6 w-6 text-amber-400 shrink-0" />
            </div>
          </GlassCard>
        </Link>

        <Link href="/wallet" className="block group">
          <GlassCard className="p-6 hover:border-emerald-500/40">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Reward Wallet
                </p>
                <h3 className="mt-2 text-2xl font-black text-emerald-400 tracking-tight">
                  ₹{wallet.balance.toLocaleString("en-IN")}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  View wallet & transaction history
                </p>
              </div>
              <Wallet2 className="h-6 w-6 text-emerald-400 shrink-0" />
            </div>
          </GlassCard>
        </Link>
      </div>
    </section>
  );
}