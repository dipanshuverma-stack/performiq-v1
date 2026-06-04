/*
  Warnings:

  - Added the required column `subject` to the `TopicProgress` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TopicProgress" ADD COLUMN     "subject" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "TopicProgress_subject_idx" ON "TopicProgress"("subject");
