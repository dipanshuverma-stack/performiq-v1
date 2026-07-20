/*
  Warnings:

  - You are about to drop the column `examType` on the `exam_profiles` table. All the data in the column will be lost.
  - Added the required column `stage` to the `exam_profiles` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ExamStage" AS ENUM ('PRELIMS', 'MAINS', 'CUSTOM');

-- AlterTable
ALTER TABLE "exam_profiles" DROP COLUMN "examType",
ADD COLUMN     "customStage" TEXT,
ADD COLUMN     "stage" "ExamStage" NOT NULL;

-- DropEnum
DROP TYPE "SectionType";
