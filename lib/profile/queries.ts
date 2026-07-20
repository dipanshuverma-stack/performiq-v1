import { cache } from "react";
import { prisma } from "@/lib/prisma";
import { getActiveExam } from "@/lib/exams/get-active-exam";
import { getPlannerToday } from "@/lib/planner/planner-date";
import { getStudyStreak } from "@/lib/rewards/queries";

export const getProfileOverview = cache(async (email: string) => {
  // Step A: Look up user by email
  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      name: true,
      email: true,
    },
  });

  if (!user) return null;

  // Step B: Fetch wallet details using user.id
  const wallet = await prisma.wallet.findUnique({
    where: { userId: user.id },
    select: {
      balance: true,
    },
  });

  // Step C: Fetch active exam via existing service using user.id
  const activeExam = await getActiveExam(user.id);

  // Step D: Fetch streak metrics using user.id
  const streak = await getStudyStreak(user.id);

  // Encapsulated countdown calculation
  let daysLeft: number | null = null;
  if (activeExam?.targetDate) {
    const today = getPlannerToday();
    const target = new Date(activeExam.targetDate);
    target.setHours(0, 0, 0, 0);
    daysLeft = Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  }

  // Return clean, UI-ready data contract
  return {
    user,
    wallet: {
      balance: wallet?.balance ?? 0,
    },
    activeExam: activeExam
      ? {
          id: activeExam.id,
          name: activeExam.name,
          examType: activeExam.examType,
          readiness: activeExam.readiness,
          targetDate: activeExam.targetDate,
          daysLeft,
        }
      : null,
    streak,
  };
});