-- CreateTable
CREATE TABLE "ExamProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "examType" TEXT NOT NULL,
    "targetDate" TIMESTAMP(3) NOT NULL,
    "readiness" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ExamProfile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ExamProfile_userId_idx" ON "ExamProfile"("userId");

-- CreateIndex
CREATE INDEX "ExamProfile_isActive_idx" ON "ExamProfile"("isActive");

-- CreateIndex
CREATE INDEX "MistakeEntry_mockId_idx" ON "MistakeEntry"("mockId");

-- AddForeignKey
ALTER TABLE "MistakeEntry" ADD CONSTRAINT "MistakeEntry_mockId_fkey" FOREIGN KEY ("mockId") REFERENCES "MockTest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExamProfile" ADD CONSTRAINT "ExamProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
