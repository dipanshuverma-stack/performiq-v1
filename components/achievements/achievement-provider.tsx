"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
} from "react";

import type { UnlockResult } from "@/lib/achievements/unlock";

type QueueItem = NonNullable<UnlockResult>;

interface AchievementContextValue {
  queue: QueueItem[];

  enqueue: (items: UnlockResult[]) => void;

  dequeue: () => void;
}

const AchievementContext =
  createContext<AchievementContextValue | null>(
    null
  );

export function AchievementProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [queue, setQueue] = useState<QueueItem[]>([]);

  const value = useMemo(
    () => ({
      queue,

      enqueue(items: UnlockResult[]) {
        const valid = items.filter(
          Boolean
        ) as QueueItem[];

        if (valid.length === 0) return;

        setQueue((current) => [
          ...current,
          ...valid,
        ]);
      },

      dequeue() {
        setQueue((current) =>
          current.slice(1)
        );
      },
    }),
    [queue]
  );

  return (
    <AchievementContext.Provider
      value={value}
    >
      {children}
    </AchievementContext.Provider>
  );
}

export function useAchievementQueue() {
  const context = useContext(
    AchievementContext
  );

  if (!context) {
    throw new Error(
      "useAchievementQueue must be used inside AchievementProvider."
    );
  }

  return context;
}