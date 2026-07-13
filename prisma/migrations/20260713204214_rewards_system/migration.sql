/*
  Warnings:

  - You are about to drop the `mock_topic_performances` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "RewardType" AS ENUM ('PLANNER', 'PRACTICE', 'MOCK', 'STREAK', 'WEEKLY_BONUS', 'MONTHLY_BONUS');

-- CreateEnum
CREATE TYPE "RewardAction" AS ENUM ('EARN', 'PENALTY', 'BONUS');

-- CreateEnum
CREATE TYPE "TopicInsightType" AS ENUM ('WEAK', 'STRONG', 'SKIPPED');

-- DropForeignKey
ALTER TABLE "mock_topic_performances" DROP CONSTRAINT "mock_topic_performances_mock_id_fkey";

-- DropForeignKey
ALTER TABLE "mock_topic_performances" DROP CONSTRAINT "mock_topic_performances_user_id_fkey";

-- AlterTable
ALTER TABLE "topic_progresses" ADD COLUMN     "lastSeenInMock" TIMESTAMP(3),
ADD COLUMN     "mistakeCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "mockAccuracy" REAL NOT NULL DEFAULT 0,
ADD COLUMN     "mockQuestions" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "mockStrongCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "mockWeakCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "practiceAccuracy" REAL NOT NULL DEFAULT 0,
ADD COLUMN     "practiceQuestions" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "practiceSessions" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "revisionCount" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "plannerRows" INTEGER NOT NULL DEFAULT 5;

-- DropTable
DROP TABLE "mock_topic_performances";

-- CreateTable
CREATE TABLE "RewardLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "rewardType" "RewardType" NOT NULL,
    "action" "RewardAction" NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "points" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sourceId" TEXT,

    CONSTRAINT "RewardLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RewardSummary" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "totalPoints" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "weeklyPoints" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "monthlyPoints" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "currentStreak" INTEGER NOT NULL DEFAULT 0,
    "longestStreak" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "month" INTEGER,
    "weekStart" TIMESTAMP(3),
    "year" INTEGER,

    CONSTRAINT "RewardSummary_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WeeklyPlan" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "rowIndex" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "time" TEXT,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "category" TEXT,
    "carryForward" BOOLEAN NOT NULL DEFAULT false,
    "plannedDate" TIMESTAMP(3) NOT NULL,
    "carryForwardDays" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "WeeklyPlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MockTopicInsight" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "mockId" TEXT NOT NULL,
    "subject" "Subject" NOT NULL,
    "topic" TEXT NOT NULL,
    "type" "TopicInsightType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "mockSubjectPerformanceId" TEXT,

    CONSTRAINT "MockTopicInsight_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "RewardLog_userId_idx" ON "RewardLog"("userId");

-- CreateIndex
CREATE INDEX "RewardLog_userId_createdAt_idx" ON "RewardLog"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "RewardLog_userId_sourceId_idx" ON "RewardLog"("userId", "sourceId");

-- CreateIndex
CREATE UNIQUE INDEX "RewardSummary_userId_key" ON "RewardSummary"("userId");

-- CreateIndex
CREATE INDEX "MockTopicInsight_userId_type_idx" ON "MockTopicInsight"("userId", "type");

-- CreateIndex
CREATE INDEX "MockTopicInsight_userId_subject_idx" ON "MockTopicInsight"("userId", "subject");

-- CreateIndex
CREATE INDEX "MockTopicInsight_userId_subject_topic_idx" ON "MockTopicInsight"("userId", "subject", "topic");

-- CreateIndex
CREATE INDEX "MockTopicInsight_mockId_idx" ON "MockTopicInsight"("mockId");

-- AddForeignKey
ALTER TABLE "RewardLog" ADD CONSTRAINT "RewardLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RewardSummary" ADD CONSTRAINT "RewardSummary_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WeeklyPlan" ADD CONSTRAINT "WeeklyPlan_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MockTopicInsight" ADD CONSTRAINT "MockTopicInsight_mockId_fkey" FOREIGN KEY ("mockId") REFERENCES "mock_tests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MockTopicInsight" ADD CONSTRAINT "MockTopicInsight_mockSubjectPerformanceId_fkey" FOREIGN KEY ("mockSubjectPerformanceId") REFERENCES "mock_subject_performances"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MockTopicInsight" ADD CONSTRAINT "MockTopicInsight_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
