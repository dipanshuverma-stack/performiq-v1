import { prisma } from "../lib/prisma";

async function main() {
  const result = await prisma.weeklyPlan.updateMany({
    data: {
      carryForward: false,
      carryForwardDays: 0,
    },
  });

  console.log(result);
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });