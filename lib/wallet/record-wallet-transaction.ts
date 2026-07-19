import { Prisma, WalletSource, WalletTransactionType } from "@prisma/client";

export interface RecordWalletTransactionInput {
  userId: string;
  type: WalletTransactionType;
  source: WalletSource;
  amount: number;
  title: string;
  description?: string;
  referenceId?: string;
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
    referenceId,
  }: RecordWalletTransactionInput
) {
  if (amount <= 0) {
    throw new Error("Transaction amount must be greater than zero.");
  }

  if (!title.trim()) {
    throw new Error("Transaction title is required.");
  }

  // Idempotency check: Prevent duplicate processing if referenceId is provided
  if (referenceId) {
    const existingTx = await tx.walletTransaction.findFirst({
      where: { userId, referenceId },
    });
    if (existingTx) {
      throw new Error(`Transaction with referenceId '${referenceId}' has already been processed.`);
    }
  }

  const isCredit = type === WalletTransactionType.CREDIT;
  const directionalAmount = isCredit ? amount : -amount;
  const sanitizedDescription = description?.trim() || undefined;

  // Find or create user wallet
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

  // Enforce zero-floor guard bound on debits
  if (!isCredit && wallet.balance < amount) {
    throw new Error("Insufficient wallet balance to perform this operation.");
  }

  // Atomic state compilation
  wallet = await tx.wallet.update({
    where: { userId },
    data: {
      balance: {
        increment: directionalAmount,
      },
      ...(isCredit
        ? { totalEarned: { increment: amount } }
        : { totalSpent: { increment: amount } }),
    },
  });

  // Write immutable historical ledger entry
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
      referenceId: referenceId?.trim() || undefined,
    },
  });

  return {
    wallet,
    transaction,
  };
}