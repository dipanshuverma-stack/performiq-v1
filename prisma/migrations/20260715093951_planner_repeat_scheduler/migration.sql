-- CreateEnum
CREATE TYPE "RepeatType" AS ENUM ('NONE', 'DAILY', 'ALTERNATE', 'EVERY_THREE_DAYS', 'CUSTOM');

-- AlterTable
ALTER TABLE "WeeklyPlan" ADD COLUMN     "repeatType" "RepeatType" NOT NULL DEFAULT 'NONE',
ADD COLUMN     "repeatWeekdays" TEXT[] DEFAULT ARRAY[]::TEXT[];
