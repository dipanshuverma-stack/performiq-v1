import { Prisma, WalletSource, WalletTransactionType } from "@prisma/client";

export interface RecordWalletTransactionInput {
  userId: string;
  type: WalletTransactionType;
  source: WalletSource;
  amount: number;
  title: string;
  description?: string;
}

export async function recordWalletTransaction(
  tx: Prisma.TransactionClient,
  {
    userId,
    type,
    source,
    amount,
    title,
    description,
  }: RecordWalletTransactionInput
) {
  if (amount <= 0) {
    throw new Error("Transaction amount must be greater than zero.");
  }

  if (!title.trim()) {
    throw new Error("Transaction title is required.");
  }

  const isCredit = type === WalletTransactionType.CREDIT;
  const directionalAmount = isCredit ? amount : -amount;
  const sanitizedDescription = description?.trim() || undefined;

  // Find or create wallet
  let wallet = await tx.wallet.findUnique({
    where: { userId },
  });

  if (!wallet) {
    wallet = await tx.wallet.create({
      data: {
        userId,
        balance: 0,
        totalEarned: 0,
        totalSpent: 0,
      },
    });
  }

  // Prevent negative balance
  if (!isCredit && wallet.balance < amount) {
    throw new Error("Insufficient wallet balance to perform this operation.");
  }

  // Update wallet
  wallet = await tx.wallet.update({
    where: { userId },
    data: {
      balance: {
        increment: directionalAmount,
      },
      ...(isCredit
        ? {
            totalEarned: {
              increment: amount,
            },
          }
        : {
            totalSpent: {
              increment: amount,
            },
          }),
    },
  });

  // Ledger entry
  const transaction = await tx.walletTransaction.create({
    data: {
      walletId: wallet.id,
      userId,
      type,
      source,
      amount,
      balanceAfter: wallet.balance,
      title: title.trim(),
      description: sanitizedDescription,
    },
  });

  return {
    wallet,
    transaction,
  };
}