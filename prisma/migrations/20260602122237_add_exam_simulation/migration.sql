-- CreateTable
CREATE TABLE "ExamSimulation" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "examName" TEXT NOT NULL,
    "totalQuestions" INTEGER NOT NULL,
    "attempted" INTEGER NOT NULL,
    "correct" INTEGER NOT NULL,
    "wrong" INTEGER NOT NULL,
    "accuracy" DOUBLE PRECISION NOT NULL,
    "qpm" DOUBLE PRECISION NOT NULL,
    "score" DOUBLE PRECISION NOT NULL,
    "durationSeconds" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ExamSimulation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ExamSimulation_userId_idx" ON "ExamSimulation"("userId");

-- AddForeignKey
ALTER TABLE "ExamSimulation" ADD CONSTRAINT "ExamSimulation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
