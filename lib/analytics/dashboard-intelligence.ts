import { cache } from "react";
import { prisma } from "@/lib/prisma";
import { getReadinessEngine } from "./readiness-engine";
import { getWeakTopics } from "./weak-topic-analytics";
import { DASHBOARD_GOALS } from "@/lib/dashboard/goals";

const getCachedReadiness = cache((userId: string) => getReadinessEngine(userId));
const getCachedWeakTopics = cache((userId: string) => getWeakTopics(userId));

export async function getDashboardIntelligence(userId: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  // Execute analytical pipelines concurrently with the batched database transaction
  const [
    readiness,
    weakTopics,
    transactionResults
  ] = await Promise.all([
    getCachedReadiness(userId),
    getCachedWeakTopics(userId),
    prisma.$transaction([
      prisma.rewardLog.findMany({
        where: {
          userId,
          action: "EARN",
          createdAt: {
            gte: today,
            lt: tomorrow,
          },
        },
        select: {
          points: true,
        },
      }),
      prisma.rewardSummary.findUnique({
        where: {
          userId,
        },
      }),
      prisma.practiceSession.aggregate({
        where: {
          userId,
        },
        _avg: {
          accuracy: true,
        },
        _count: {
          id: true,
        },
      }),
      prisma.mockTest.aggregate({
        where: {
          userId,
        },
        _avg: {
          score: true,
        },
      }),
      // Step 19.1: Querying outstanding daily planner items inside the transaction batch
      prisma.weeklyPlan.count({
        where: {
          userId,
          completed: false,
          plannedDate: {
            gte: today,
            lt: tomorrow,
          },
        },
      }),
      // Step 19.1: Verify if an assessment was already logged for today
      prisma.mockTest.count({
        where: {
          userId,
          createdAt: {
            gte: today,
            lt: tomorrow,
          },
        },
      }),
    ])
  ]);

  const [
    todayRewards, 
    rewardSummary, 
    practiceAggregate, 
    mockAggregate,
    plannerRemaining,
    mocksTodayCount
  ] = transactionResults;

  const currentXP = todayRewards.reduce(
    (sum, reward) => sum + reward.points,
    0
  );

  const consistencyGoal = DASHBOARD_GOALS.daily.consistency.xp;
  const fullPowerGoal = DASHBOARD_GOALS.daily.fullPower.xp;
  const consistencyCompleted = currentXP >= consistencyGoal;
  const fullPowerCompleted = currentXP >= fullPowerGoal;

  // Step 19.1 & 19.2: Priority-based decision engine with flexible action metadata
  let nextAction = {
    title: "",
    description: "",
    href: "/",
    button: "",
  };

  if (plannerRemaining > 0) {
    nextAction = {
      title: "Complete Today's Planner",
      description: `You have ${plannerRemaining} scheduled task${plannerRemaining > 1 ? "s" : ""} left for today.`,
      href: "/planner",
      button: "Go to Planner",
    };
  } else if (!consistencyCompleted) {
    const xpLeft = consistencyGoal - currentXP;
    nextAction = {
      title: "Continue Practice",
      description: `Earn ${xpLeft} more XP to reach today's core consistency target.`,
      href: "/practice",
      button: "Resume Practice",
    };
  } else if (mocksTodayCount === 0) {
    nextAction = {
      title: "Attempt a Mock Test",
      description: "Keep exam readiness sharp with a timed test simulation.",
      href: "/mocks",
      button: "Launch Mock Test",
    };
  } else if (!fullPowerCompleted) {
    const xpLeft = fullPowerGoal - currentXP;
    nextAction = {
      title: "Push for Full Power",
      description: `Only ${xpLeft} XP away from securing maximum reward points today.`,
      href: "/practice",
      button: "Maximize XP Output",
    };
  } else {
    nextAction = {
      title: "Today's Mission Complete",
      description: "Amazing dedication. All targets met—take a breather!",
      href: "/dashboard",
      button: "All Systems Green",
    };
  }

  const priorities = weakTopics
    .slice(0, 5)
    .map((topic) => ({
      topic: topic.topic,
      focusScore: 100 - Math.round(topic.accuracy),
      mastery: Math.round(topic.accuracy),
    }));

  const nextFocusTopic = priorities.length > 0 
    ? priorities[0].topic 
    : "Start today's practice";

  return {
    readiness,
    currentStreak: rewardSummary?.currentStreak ?? 0,
    totalSessions: practiceAggregate._count.id ?? 0,
    averageAccuracy: Math.round(practiceAggregate._avg.accuracy ?? 0),
    averageMockScore: Math.round(mockAggregate._avg.score ?? 0),

    priorities,
    nextFocusTopic,
    currentXP,
    consistencyGoal,
    fullPowerGoal,
    consistencyCompleted,
    fullPowerCompleted,
    consistencyReward: DASHBOARD_GOALS.daily.consistency.reward,
    fullPowerReward: DASHBOARD_GOALS.daily.fullPower.reward,
    
    nextAction,
  };
}

export type DashboardIntelligence = Awaited<
  ReturnType<typeof getDashboardIntelligence>
>;