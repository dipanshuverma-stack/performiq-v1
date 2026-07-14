// prisma/seed-achievements.ts
import { PrismaClient } from "@prisma/client";
import { ACHIEVEMENTS } from "../lib/achievements/catalog";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting achievement catalog sync...");
  
  const definitions = Object.values(ACHIEVEMENTS);

  // Execute inside a single batch transaction for speed and rollback safety
  const operations = definitions.map((achievement) =>
    prisma.achievement.upsert({
      where: { key: achievement.key },
      update: {
        title: achievement.title,
        description: achievement.description,
        icon: achievement.icon,
        category: achievement.category,
        rarity: achievement.rarity,
        rewardPoints: achievement.rewardPoints,
        xp: achievement.xp,
        hidden: achievement.hidden,
        sortOrder: achievement.sortOrder,
      },
      create: {
        key: achievement.key,
        title: achievement.title,
        description: achievement.description,
        icon: achievement.icon,
        category: achievement.category,
        rarity: achievement.rarity,
        rewardPoints: achievement.rewardPoints,
        xp: achievement.xp,
        hidden: achievement.hidden,
        sortOrder: achievement.sortOrder,
      },
    })
  );

  await prisma.$transaction(operations);
  
  console.log(`Successfully synced ${definitions.length} achievements to the database.`);
}

main()
  .catch((e) => {
    console.error("Error seeding achievements:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });