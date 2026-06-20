import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

const PAGE_SIZE = 20;

interface GetPracticeHistoryArgs {
  where: Prisma.PracticeSessionWhereInput;
  orderBy?: Prisma.PracticeSessionOrderByWithRelationInput;
  cursor?: string;
}

export async function getPracticeHistory({
  where,
  orderBy = { createdAt: "desc" }, // Defaults to newest first if not explicitly overridden
  cursor,
}: GetPracticeHistoryArgs) {
  const sessions = await prisma.practiceSession.findMany({
    where,
    orderBy,
    take: PAGE_SIZE + 1,
    ...(cursor && {
      skip: 1,
      cursor: {
        id: cursor,
      },
    }),
  });

  let nextCursor: string | null = null;

  if (sessions.length > PAGE_SIZE) {
    const next = sessions.pop();
    nextCursor = next!.id;
  }

  return {
    sessions,
    nextCursor,
  };
}