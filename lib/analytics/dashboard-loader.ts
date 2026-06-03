import { prisma } from "@/lib/prisma";

export async function getDashboardData(userId: string) {
  // Executing all queries in parallel for maximum performance
  const [
    studyAggregate,
    mockStats,
    revisionStats,
    activeExam,
    mocks,
    priorities
  ] = await Promise.all([
    prisma.studySession.aggregate({ 
      where: { userId }, 
      _sum: { duration: true }, 
      _count: { id: true } 
    }),
    prisma.mockTest.aggregate({ 
      where: { userId }, 
      _avg: { accuracy: true }, 
      _count: { id: true } 
    }),
    prisma.revision.aggregate({ 
      where: { userId }, 
      _count: { id: true } 
    }),
    prisma.examProfile.findFirst({ 
      // CORRECTED: 'active' changed to 'isActive' to match your Prisma schema
      where: { userId, isActive: true } 
    }),
    prisma.mockTest.findMany({ 
      where: { userId } 
    }),
    prisma.topicProgress.findMany({ 
      where: { userId, completed: false },
      take: 5 
    })
  ]);

  return {
    studyAggregate,
    mockStats,
    revisionStats,
    activeExam,
    mocks: { 
      data: mocks, 
      avgAccuracy: mockStats._avg.accuracy || 0 
    },
    priorities,
    readiness: mockStats._avg.accuracy || 0,
  };
}