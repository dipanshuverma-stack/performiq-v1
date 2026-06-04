/*
  Warnings:

  - You are about to drop the `ExamSimulation` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ExamSimulation" DROP CONSTRAINT "ExamSimulation_userId_fkey";

-- DropTable
DROP TABLE "ExamSimulation";
