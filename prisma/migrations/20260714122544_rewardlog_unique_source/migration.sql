/*
  Warnings:

  - A unique constraint covering the columns `[userId,sourceId]` on the table `RewardLog` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "RewardLog_userId_sourceId_key" ON "RewardLog"("userId", "sourceId");
