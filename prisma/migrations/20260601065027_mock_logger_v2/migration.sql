/*
  Warnings:

  - You are about to drop the column `durationMinutes` on the `StudySession` table. All the data in the column will be lost.
  - You are about to drop the column `endedAt` on the `StudySession` table. All the data in the column will be lost.
  - You are about to drop the column `notes` on the `StudySession` table. All the data in the column will be lost.
  - You are about to drop the column `startedAt` on the `StudySession` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `StudySession` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `Task` table. All the data in the column will be lost.
  - You are about to drop the column `dueDate` on the `Task` table. All the data in the column will be lost.
  - You are about to drop the column `scheduledEnd` on the `Task` table. All the data in the column will be lost.
  - You are about to drop the column `scheduledStart` on the `Task` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Task` table. All the data in the column will be lost.
  - You are about to drop the column `avatarUrl` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `passwordHash` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `timezone` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `MistakeJournalEntry` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MockAttempt` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Notification` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `QuestionAttempt` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ReadinessSnapshot` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `RevisionCard` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `RevisionReview` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TaskLog` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserAchievement` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserExam` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserStreak` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `duration` to the `StudySession` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subject` to the `StudySession` table without a default value. This is not possible if the table is not empty.
  - Added the required column `topic` to the `StudySession` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "MockType" AS ENUM ('PRELIMS', 'MAINS');

-- CreateEnum
CREATE TYPE "MistakeType" AS ENUM ('CONCEPTUAL', 'SILLY', 'GUESS', 'TIME_MANAGEMENT', 'CALCULATION', 'QUESTION_MISREAD');

-- DropForeignKey
ALTER TABLE "MistakeJournalEntry" DROP CONSTRAINT "MistakeJournalEntry_userId_fkey";

-- DropForeignKey
ALTER TABLE "MockAttempt" DROP CONSTRAINT "MockAttempt_userId_fkey";

-- DropForeignKey
ALTER TABLE "Notification" DROP CONSTRAINT "Notification_userId_fkey";

-- DropForeignKey
ALTER TABLE "QuestionAttempt" DROP CONSTRAINT "QuestionAttempt_userId_fkey";

-- DropForeignKey
ALTER TABLE "ReadinessSnapshot" DROP CONSTRAINT "ReadinessSnapshot_userId_fkey";

-- DropForeignKey
ALTER TABLE "RevisionCard" DROP CONSTRAINT "RevisionCard_userId_fkey";

-- DropForeignKey
ALTER TABLE "RevisionReview" DROP CONSTRAINT "RevisionReview_revisionCardId_fkey";

-- DropForeignKey
ALTER TABLE "RevisionReview" DROP CONSTRAINT "RevisionReview_userId_fkey";

-- DropForeignKey
ALTER TABLE "TaskLog" DROP CONSTRAINT "TaskLog_taskId_fkey";

-- DropForeignKey
ALTER TABLE "TaskLog" DROP CONSTRAINT "TaskLog_userId_fkey";

-- DropForeignKey
ALTER TABLE "UserAchievement" DROP CONSTRAINT "UserAchievement_userId_fkey";

-- DropForeignKey
ALTER TABLE "UserExam" DROP CONSTRAINT "UserExam_userId_fkey";

-- DropForeignKey
ALTER TABLE "UserStreak" DROP CONSTRAINT "UserStreak_userId_fkey";

-- AlterTable
ALTER TABLE "StudySession" DROP COLUMN "durationMinutes",
DROP COLUMN "endedAt",
DROP COLUMN "notes",
DROP COLUMN "startedAt",
DROP COLUMN "title",
ADD COLUMN     "completed" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "duration" INTEGER NOT NULL,
ADD COLUMN     "subject" TEXT NOT NULL,
ADD COLUMN     "topic" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Task" DROP COLUMN "description",
DROP COLUMN "dueDate",
DROP COLUMN "scheduledEnd",
DROP COLUMN "scheduledStart",
DROP COLUMN "updatedAt";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "avatarUrl",
DROP COLUMN "createdAt",
DROP COLUMN "passwordHash",
DROP COLUMN "role",
DROP COLUMN "timezone",
DROP COLUMN "updatedAt",
ADD COLUMN     "emailVerified" TIMESTAMP(3),
ADD COLUMN     "image" TEXT,
ALTER COLUMN "email" DROP NOT NULL;

-- DropTable
DROP TABLE "MistakeJournalEntry";

-- DropTable
DROP TABLE "MockAttempt";

-- DropTable
DROP TABLE "Notification";

-- DropTable
DROP TABLE "QuestionAttempt";

-- DropTable
DROP TABLE "ReadinessSnapshot";

-- DropTable
DROP TABLE "RevisionCard";

-- DropTable
DROP TABLE "RevisionReview";

-- DropTable
DROP TABLE "TaskLog";

-- DropTable
DROP TABLE "UserAchievement";

-- DropTable
DROP TABLE "UserExam";

-- DropTable
DROP TABLE "UserStreak";

-- DropEnum
DROP TYPE "UserRole";

-- CreateTable
CREATE TABLE "TopicProgress" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "topicName" TEXT NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TopicProgress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Revision" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "topic" TEXT NOT NULL,
    "revisionCount" INTEGER NOT NULL DEFAULT 0,
    "nextRevision" TIMESTAMP(3) NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Revision_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MockTest" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "exam" TEXT NOT NULL,
    "title" TEXT,
    "mockType" "MockType",
    "score" DOUBLE PRECISION NOT NULL,
    "totalQuestions" INTEGER NOT NULL,
    "attemptedQuestions" INTEGER NOT NULL DEFAULT 0,
    "correctAnswers" INTEGER NOT NULL DEFAULT 0,
    "incorrectAnswers" INTEGER NOT NULL DEFAULT 0,
    "unattemptedQuestions" INTEGER NOT NULL DEFAULT 0,
    "accuracy" DOUBLE PRECISION NOT NULL,
    "percentile" DOUBLE PRECISION,
    "rank" INTEGER,
    "duration" INTEGER,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MockTest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MockSubjectPerformance" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "mockId" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "totalQuestions" INTEGER NOT NULL,
    "attempted" INTEGER NOT NULL,
    "correct" INTEGER NOT NULL,
    "incorrect" INTEGER NOT NULL,
    "score" DOUBLE PRECISION NOT NULL,
    "accuracy" DOUBLE PRECISION NOT NULL,
    "timeSpent" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MockSubjectPerformance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MockTopicPerformance" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "mockId" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "topic" TEXT NOT NULL,
    "correct" INTEGER NOT NULL DEFAULT 0,
    "incorrect" INTEGER NOT NULL DEFAULT 0,
    "skipped" INTEGER NOT NULL DEFAULT 0,
    "accuracy" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MockTopicPerformance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MistakeEntry" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "mockId" TEXT,
    "subject" TEXT NOT NULL,
    "topic" TEXT,
    "mistakeType" "MistakeType" NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MistakeEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateIndex
CREATE INDEX "TopicProgress_userId_idx" ON "TopicProgress"("userId");

-- CreateIndex
CREATE INDEX "Revision_userId_idx" ON "Revision"("userId");

-- CreateIndex
CREATE INDEX "MockTest_userId_idx" ON "MockTest"("userId");

-- CreateIndex
CREATE INDEX "MockTest_mockType_idx" ON "MockTest"("mockType");

-- CreateIndex
CREATE INDEX "MockTest_createdAt_idx" ON "MockTest"("createdAt");

-- CreateIndex
CREATE INDEX "MockSubjectPerformance_userId_idx" ON "MockSubjectPerformance"("userId");

-- CreateIndex
CREATE INDEX "MockSubjectPerformance_mockId_idx" ON "MockSubjectPerformance"("mockId");

-- CreateIndex
CREATE INDEX "MockSubjectPerformance_subject_idx" ON "MockSubjectPerformance"("subject");

-- CreateIndex
CREATE INDEX "MockTopicPerformance_userId_idx" ON "MockTopicPerformance"("userId");

-- CreateIndex
CREATE INDEX "MockTopicPerformance_mockId_idx" ON "MockTopicPerformance"("mockId");

-- CreateIndex
CREATE INDEX "MockTopicPerformance_subject_idx" ON "MockTopicPerformance"("subject");

-- CreateIndex
CREATE INDEX "MockTopicPerformance_topic_idx" ON "MockTopicPerformance"("topic");

-- CreateIndex
CREATE INDEX "MistakeEntry_userId_idx" ON "MistakeEntry"("userId");

-- CreateIndex
CREATE INDEX "MistakeEntry_mistakeType_idx" ON "MistakeEntry"("mistakeType");

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- AddForeignKey
ALTER TABLE "TopicProgress" ADD CONSTRAINT "TopicProgress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Revision" ADD CONSTRAINT "Revision_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MockTest" ADD CONSTRAINT "MockTest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MockSubjectPerformance" ADD CONSTRAINT "MockSubjectPerformance_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MockSubjectPerformance" ADD CONSTRAINT "MockSubjectPerformance_mockId_fkey" FOREIGN KEY ("mockId") REFERENCES "MockTest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MockTopicPerformance" ADD CONSTRAINT "MockTopicPerformance_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MockTopicPerformance" ADD CONSTRAINT "MockTopicPerformance_mockId_fkey" FOREIGN KEY ("mockId") REFERENCES "MockTest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MistakeEntry" ADD CONSTRAINT "MistakeEntry_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
