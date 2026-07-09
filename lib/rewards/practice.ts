import { prisma } from "@/lib/prisma";
import { RewardAction, RewardType } from "@prisma/client";
import { addReward } from "./reward-log";

const MILESTONES = [
  { minutes: 90, points: 35 },
  { minutes: 60, points: 25 },
  { minutes: 45, points: 20 },
  { minutes: 30, points: 15 },
  { minutes: 20, points: 10 },
  { minutes: 10, points: 5 },
];

export async function evaluatePracticeReward(userId: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const sessions = await prisma.studySession.findMany({
    where: {
      userId,
      completed: true,
      createdAt: {
        gte: today,
        lt: tomorrow,
      },
    },
    select: {
      duration: true,
    },
  });

  const totalMinutes = sessions.reduce(
    (sum, session) => sum + session.duration,
    0
  );

  const milestone = MILESTONES.find(
    (m) => totalMinutes >= m.minutes
  );

  if (!milestone) return;

  await addReward(
    userId,
    RewardType.PRACTICE,
    RewardAction.EARN,
    milestone.points,
    `${milestone.minutes} Minutes Practice`,
    `Practiced ${totalMinutes} minutes today.`,
    `practice-${today.toISOString().slice(0, 10)}`
  );
}