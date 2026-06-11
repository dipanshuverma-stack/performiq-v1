/*
  Warnings:

  - You are about to drop the `PracticeSession` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[userId,topic]` on the table `Revision` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,subject,topicName]` on the table `TopicProgress` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `mistakeType` on the `Mistake` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "RevisionStatus" AS ENUM ('UNRESOLVED', 'IN_PROGRESS', 'MASTERED');

-- CreateEnum
CREATE TYPE "Difficulty" AS ENUM ('EASY', 'MEDIUM', 'HARD');

-- DropForeignKey
ALTER TABLE "PracticeSession" DROP CONSTRAINT "PracticeSession_userId_fkey";

-- DropIndex
DROP INDEX "Revision_userId_idx";

-- DropIndex
DROP INDEX "TopicProgress_subject_idx";

-- DropIndex
DROP INDEX "TopicProgress_userId_idx";

-- AlterTable
ALTER TABLE "Mistake" DROP COLUMN "mistakeType",
ADD COLUMN     "mistakeType" "MistakeType" NOT NULL;

-- DropTable
DROP TABLE "PracticeSession";

-- CreateTable
CREATE TABLE "practice_sessions" (
    "id" TEXT NOT NULL,
    "sessionUuid" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "topic" TEXT NOT NULL,
    "difficulty" "Difficulty",
    "totalQuestions" INTEGER NOT NULL,
    "correctQuestions" INTEGER NOT NULL,
    "incorrectQuestions" INTEGER NOT NULL,
    "durationSeconds" INTEGER NOT NULL,
    "accuracy" DOUBLE PRECISION NOT NULL,
    "qpm" DOUBLE PRECISION NOT NULL,
    "mistakeCount" INTEGER NOT NULL DEFAULT 0,
    "revisionStatus" "RevisionStatus" NOT NULL DEFAULT 'UNRESOLVED',
    "confidenceScore" INTEGER,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "practice_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "practice_sessions_userId_createdAt_idx" ON "practice_sessions"("userId", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "practice_sessions_userId_subject_idx" ON "practice_sessions"("userId", "subject");

-- CreateIndex
CREATE INDEX "practice_sessions_userId_topic_idx" ON "practice_sessions"("userId", "topic");

-- CreateIndex
CREATE INDEX "practice_sessions_userId_revisionStatus_idx" ON "practice_sessions"("userId", "revisionStatus");

-- CreateIndex
CREATE INDEX "practice_sessions_userId_confidenceScore_idx" ON "practice_sessions"("userId", "confidenceScore");

-- CreateIndex
CREATE UNIQUE INDEX "practice_sessions_userId_sessionUuid_key" ON "practice_sessions"("userId", "sessionUuid");

-- CreateIndex
CREATE INDEX "Revision_userId_nextRevision_idx" ON "Revision"("userId", "nextRevision");

-- CreateIndex
CREATE UNIQUE INDEX "Revision_userId_topic_key" ON "Revision"("userId", "topic");

-- CreateIndex
CREATE INDEX "TopicProgress_userId_subject_completed_idx" ON "TopicProgress"("userId", "subject", "completed");

-- CreateIndex
CREATE UNIQUE INDEX "TopicProgress_userId_subject_topicName_key" ON "TopicProgress"("userId", "subject", "topicName");

-- AddForeignKey
ALTER TABLE "practice_sessions" ADD CONSTRAINT "practice_sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
