import { prisma } from "@/lib/prisma";

export async function getDashboardData(userId: string) {
  // Placeholder
  return {
    // XP
    currentXP: 0,
    consistencyGoal: 100,
    fullPowerGoal: 200,

    // Rewards
    consistencyReward: 50,
    fullPowerReward: 100,

    // Mission
    consistencyCompleted: false,
    fullPowerCompleted: false,

    // Next Action
    nextAction: "Practice",

    // Focus
    focusTopic: "Probability",

    // Stats
    priorityTopics: 0,
    streak: 0,
  };
}