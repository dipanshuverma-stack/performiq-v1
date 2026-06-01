/*
  Warnings:

  - You are about to drop the column `mistakeType` on the `MistakeEntry` table. All the data in the column will be lost.
  - You are about to drop the column `mockId` on the `MistakeEntry` table. All the data in the column will be lost.
  - You are about to drop the column `notes` on the `MistakeEntry` table. All the data in the column will be lost.
  - Added the required column `question` to the `MistakeEntry` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `MistakeEntry` table without a default value. This is not possible if the table is not empty.
  - Made the column `topic` on table `MistakeEntry` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "MistakeEntry" DROP CONSTRAINT "MistakeEntry_mockId_fkey";

-- DropIndex
DROP INDEX "MistakeEntry_mistakeType_idx";

-- DropIndex
DROP INDEX "MistakeEntry_mockId_idx";

-- AlterTable
ALTER TABLE "MistakeEntry" DROP COLUMN "mistakeType",
DROP COLUMN "mockId",
DROP COLUMN "notes",
ADD COLUMN     "explanation" TEXT,
ADD COLUMN     "mockTestId" TEXT,
ADD COLUMN     "question" TEXT NOT NULL,
ADD COLUMN     "resolved" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "source" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "topic" SET NOT NULL;

-- CreateIndex
CREATE INDEX "MistakeEntry_subject_idx" ON "MistakeEntry"("subject");

-- CreateIndex
CREATE INDEX "MistakeEntry_topic_idx" ON "MistakeEntry"("topic");

-- CreateIndex
CREATE INDEX "MistakeEntry_resolved_idx" ON "MistakeEntry"("resolved");

-- AddForeignKey
ALTER TABLE "MistakeEntry" ADD CONSTRAINT "MistakeEntry_mockTestId_fkey" FOREIGN KEY ("mockTestId") REFERENCES "MockTest"("id") ON DELETE SET NULL ON UPDATE CASCADE;
