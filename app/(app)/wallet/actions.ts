"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { WalletSource, WalletTransactionType } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { recordWalletTransaction } from "@/lib/wallet/record-wallet-transaction";

/**
 * Reusable session authentication utility to retrieve the internal system User ID.
 * Can be extracted to a centralized `lib/auth/get-user-id.ts` path later.
 */
async function getUserId(): Promise<string> {
  const session = await auth();

  if (!session?.user?.email) {
    throw new Error("Unauthorized");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true },
  });

  if (!user) {
    throw new Error("User record not found");
  }

  return user.id;
}

/**
 * Retrieves the current state of a user's financial profile, the most recent 
 * transaction rows, and a complete historical transaction count for pagination headers.
 */
export async function getWallet() {
  const session = await auth();
  if (!session?.user?.email) return null;

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true },
  });

  if (!user) return null;

  const [wallet, transactions, totalEntriesCount] = await Promise.all([
    prisma.wallet.findUnique({
      where: { userId: user.id },
    }),
    prisma.walletTransaction.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: 30,
    }),
    prisma.walletTransaction.count({
      where: { userId: user.id },
    }),
  ]);

  return {
    wallet,
    transactions,
    totalEntriesCount,
  };
}

/**
 * Orchestrates manual wallet corrections submitted via the administrative/manager UI.
 * Delegates the heavy lifting of updates and ledger inserts to recordWalletTransaction.
 */
export async function adjustWallet(
  type: WalletTransactionType,
  amount: number,
  title: string,
  description?: string
) {
  const userId = await getUserId();

  // Guard against non-finite integers, sub-zero totals, or missing payloads
  if (!Number.isFinite(amount) || amount <= 0) {
    throw new Error("Invalid amount value provided.");
  }

  if (!title.trim()) {
    throw new Error("A transaction summary title is required.");
  }

  // Defer fully validated object models to our transactional helper
  await prisma.$transaction(async (tx) => {
    await recordWalletTransaction(tx, {
      userId,
      type,
      source:
        type === WalletTransactionType.CREDIT
          ? WalletSource.MANUAL_ADD
          : WalletSource.MANUAL_REMOVE,
      amount,
      title: title.trim(),
      description: description?.trim() || undefined,
    });
  });

  // Evict outdated server caches
  revalidatePath("/wallet");
}