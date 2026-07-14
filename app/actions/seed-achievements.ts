"use server";

import { prisma } from "@/lib/prisma";
import { ACHIEVEMENTS } from "@/lib/achievements/catalog";
import { revalidatePath } from "next/cache";

export async function seedAchievements() {
  const definitions = Object.values(ACHIEVEMENTS);

  for (const achievement of definitions) {
    const data = {
      title: achievement.title,
      description: achievement.description,
      icon: achievement.icon,
      category: achievement.category,
      rarity: achievement.rarity,
      rewardPoints: achievement.rewardPoints,
      xp: achievement.xp,
      hidden: achievement.hidden,
      sortOrder: achievement.sortOrder,
    };

    await prisma.achievement.upsert({
      where: {
        key: achievement.key,
      },
      update: data,
      create: {
        key: achievement.key,
        ...data,
      },
    });
  }

  revalidatePath("/achievements");
}