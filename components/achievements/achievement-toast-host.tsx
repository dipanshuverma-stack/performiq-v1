"use client";

import { useEffect } from "react";

import AchievementToast from "./achievement-toast";
import { useAchievementQueue } from "./achievement-provider";

export default function AchievementToastHost() {
  const { queue, dequeue } = useAchievementQueue();

  const current = queue[0];

  useEffect(() => {
    if (!current) return;

    const timer = setTimeout(() => {
      dequeue();
    }, 4000);

    return () => clearTimeout(timer);
  }, [current, dequeue]);

  if (!current) {
    return null;
  }

  return (
    <div
      className="
        fixed
        top-6
        right-6
        z-[100]
        pointer-events-none
      "
    >
      <AchievementToast
        achievement={current.achievement}
      />
    </div>
  );
}