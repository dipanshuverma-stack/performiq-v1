/*
  Warnings:

  - You are about to drop the column `exam_type` on the `exam_profiles` table. All the data in the column will be lost.
  - You are about to drop the column `correct` on the `mock_subject_performances` table. All the data in the column will be lost.
  - You are about to drop the column `incorrectQuestions` on the `mock_subject_performances` table. All the data in the column will be lost.
  - You are about to drop the column `correctQuestions_answers` on the `mock_tests` table. All the data in the column will be lost.
  - You are about to drop the column `incorrectQuestions_answers` on the `mock_tests` table. All the data in the column will be lost.
  - You are about to drop the column `correct` on the `mock_topic_performances` table. All the data in the column will be lost.
  - You are about to drop the column `incorrectQuestions` on the `mock_topic_performances` table. All the data in the column will be lost.
  - You are about to drop the column `correctQuestions_questions` on the `practice_sessions` table. All the data in the column will be lost.
  - You are about to drop the column `incorrectQuestions_questions` on the `practice_sessions` table. All the data in the column will be lost.
  - Added the required column `examType` to the `exam_profiles` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `subject` on the `mistake_entries` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `subject` on the `mistakes` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `correct_questions` to the `mock_subject_performances` table without a default value. This is not possible if the table is not empty.
  - Added the required column `incorrect_questions` to the `mock_subject_performances` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `subject` on the `mock_subject_performances` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `exam` on the `mock_tests` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `subject` on the `mock_topic_performances` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `correct_questions` to the `practice_sessions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `incorrect_questions` to the `practice_sessions` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `subject` on the `practice_sessions` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `subject` on the `revisions` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `subject` on the `study_sessions` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `subject` on the `topic_progresses` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "TaskPriority" AS ENUM ('LOW', 'MEDIUM', 'HIGH');

-- CreateEnum
CREATE TYPE "StudySessionType" AS ENUM ('STUDY', 'REVISION', 'PRACTICE', 'MOCK_ANALYSIS');

-- CreateEnum
CREATE TYPE "Subject" AS ENUM ('QUANTITATIVE_APTITUDE', 'REASONING_ABILITY', 'ENGLISH_LANGUAGE', 'GENERAL_AWARENESS', 'COMPUTER_AWARENESS');

-- CreateEnum
CREATE TYPE "SectionType" AS ENUM ('PRELIMS', 'MAINS');

-- CreateEnum
CREATE TYPE "ExamType" AS ENUM ('IBPS_PO', 'IBPS_CLERK', 'SBI_PO', 'SBI_CLERK', 'RRB_PO', 'RRB_CLERK', 'RBI_ASSISTANT', 'RBI_GRADE_B', 'NABARD', 'LIC_AAO');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "Difficulty" ADD VALUE 'MIXED';
ALTER TYPE "Difficulty" ADD VALUE 'MAINS';

-- DropForeignKey
ALTER TABLE "mistake_entries" DROP CONSTRAINT "mistake_entries_mock_test_id_fkey";

-- AlterTable
ALTER TABLE "exam_profiles" DROP COLUMN "exam_type",
ADD COLUMN     "attemptDate" TIMESTAMP(3),
ADD COLUMN     "examType" "ExamType" NOT NULL,
ADD COLUMN     "priority" INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE "mistake_entries" ADD COLUMN     "difficulty" "Difficulty" NOT NULL DEFAULT 'MEDIUM',
DROP COLUMN "subject",
ADD COLUMN     "subject" "Subject" NOT NULL;

-- AlterTable
ALTER TABLE "mistakes" DROP COLUMN "subject",
ADD COLUMN     "subject" "Subject" NOT NULL;

-- AlterTable
ALTER TABLE "mock_subject_performances" DROP COLUMN "correct",
DROP COLUMN "incorrectQuestions",
ADD COLUMN     "correct_questions" INTEGER NOT NULL,
ADD COLUMN     "incorrect_questions" INTEGER NOT NULL,
DROP COLUMN "subject",
ADD COLUMN     "subject" "Subject" NOT NULL;

-- AlterTable
ALTER TABLE "mock_tests" DROP COLUMN "correctQuestions_answers",
DROP COLUMN "incorrectQuestions_answers",
ADD COLUMN     "correct_answers" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "incorrect_answers" INTEGER NOT NULL DEFAULT 0,
DROP COLUMN "exam",
ADD COLUMN     "exam" "ExamType" NOT NULL;

-- AlterTable
ALTER TABLE "mock_topic_performances" DROP COLUMN "correct",
DROP COLUMN "incorrectQuestions",
ADD COLUMN     "correct_questions" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "incorrect_questions" INTEGER NOT NULL DEFAULT 0,
DROP COLUMN "subject",
ADD COLUMN     "subject" "Subject" NOT NULL;

-- AlterTable
ALTER TABLE "practice_sessions" DROP COLUMN "correctQuestions_questions",
DROP COLUMN "incorrectQuestions_questions",
ADD COLUMN     "correct_questions" INTEGER NOT NULL,
ADD COLUMN     "incorrect_questions" INTEGER NOT NULL,
DROP COLUMN "subject",
ADD COLUMN     "subject" "Subject" NOT NULL;

-- AlterTable
ALTER TABLE "revisions" DROP COLUMN "subject",
ADD COLUMN     "subject" "Subject" NOT NULL;

-- AlterTable
ALTER TABLE "study_sessions" ADD COLUMN     "sessionType" "StudySessionType",
DROP COLUMN "subject",
ADD COLUMN     "subject" "Subject" NOT NULL;

-- AlterTable
ALTER TABLE "tasks" ADD COLUMN     "completedAt" TIMESTAMP(3),
ADD COLUMN     "description" TEXT,
ADD COLUMN     "dueDate" TIMESTAMP(3),
ADD COLUMN     "priority" "TaskPriority" NOT NULL DEFAULT 'MEDIUM',
ADD COLUMN     "subject" "Subject",
ADD COLUMN     "topic" TEXT;

-- AlterTable
ALTER TABLE "topic_progresses" ADD COLUMN     "confidence" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "lastPracticedAt" TIMESTAMP(3),
ADD COLUMN     "lastRevisedAt" TIMESTAMP(3),
ADD COLUMN     "lastStudiedAt" TIMESTAMP(3),
DROP COLUMN "subject",
ADD COLUMN     "subject" "Subject" NOT NULL;

-- CreateTable
CREATE TABLE "notification_preferences" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "revisionDue" BOOLEAN NOT NULL DEFAULT true,
    "weakTopicAlert" BOOLEAN NOT NULL DEFAULT true,
    "mockReminder" BOOLEAN NOT NULL DEFAULT true,
    "studyReminder" BOOLEAN NOT NULL DEFAULT true,
    "achievementAlert" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "notification_preferences_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "notification_preferences_userId_key" ON "notification_preferences"("userId");

-- CreateIndex
CREATE INDEX "exam_profiles_priority_idx" ON "exam_profiles"("priority");

-- CreateIndex
CREATE INDEX "mistake_entries_subject_idx" ON "mistake_entries"("subject");

-- CreateIndex
CREATE INDEX "mistakes_subject_idx" ON "mistakes"("subject");

-- CreateIndex
CREATE INDEX "mock_subject_performances_subject_idx" ON "mock_subject_performances"("subject");

-- CreateIndex
CREATE INDEX "mock_topic_performances_subject_idx" ON "mock_topic_performances"("subject");

-- CreateIndex
CREATE INDEX "practice_sessions_user_id_subject_idx" ON "practice_sessions"("user_id", "subject");

-- CreateIndex
CREATE INDEX "study_sessions_user_id_subject_idx" ON "study_sessions"("user_id", "subject");

-- CreateIndex
CREATE INDEX "study_sessions_user_id_topic_idx" ON "study_sessions"("user_id", "topic");

-- CreateIndex
CREATE INDEX "tasks_user_id_completed_idx" ON "tasks"("user_id", "completed");

-- CreateIndex
CREATE INDEX "tasks_user_id_dueDate_idx" ON "tasks"("user_id", "dueDate");

-- CreateIndex
CREATE INDEX "tasks_user_id_priority_idx" ON "tasks"("user_id", "priority");

-- CreateIndex
CREATE INDEX "topic_progresses_user_id_subject_completed_idx" ON "topic_progresses"("user_id", "subject", "completed");

-- CreateIndex
CREATE UNIQUE INDEX "topic_progresses_user_id_subject_topic_name_key" ON "topic_progresses"("user_id", "subject", "topic_name");

-- AddForeignKey
ALTER TABLE "notification_preferences" ADD CONSTRAINT "notification_preferences_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mistake_entries" ADD CONSTRAINT "mistake_entries_mock_test_id_fkey" FOREIGN KEY ("mock_test_id") REFERENCES "mock_tests"("id") ON DELETE CASCADE ON UPDATE CASCADE;
