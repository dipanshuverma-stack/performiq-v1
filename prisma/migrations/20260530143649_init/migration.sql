-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExamProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "examName" TEXT NOT NULL,
    "phase" TEXT NOT NULL,
    "targetDate" TIMESTAMP(3) NOT NULL,
    "targetScore" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ExamProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Mock" (
    "id" TEXT NOT NULL,
    "examProfileId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "totalScore" DOUBLE PRECISION NOT NULL,
    "accuracy" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Mock_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "ExamProfile" ADD CONSTRAINT "ExamProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Mock" ADD CONSTRAINT "Mock_examProfileId_fkey" FOREIGN KEY ("examProfileId") REFERENCES "ExamProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
