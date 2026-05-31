"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function completeRevision(id: string) {
  const revision = await prisma.revision.findUnique({
    where: {
      id,
    },
  });

  if (!revision) {
    return;
  }

  let daysToAdd = 30;

  switch (revision.revisionCount) {
    case 0:
      daysToAdd = 3;
      break;

    case 1:
      daysToAdd = 7;
      break;

    case 2:
      daysToAdd = 15;
      break;

    case 3:
      daysToAdd = 30;
      break;

    default:
      daysToAdd = 30;
  }

  const nextRevisionDate = new Date();

  nextRevisionDate.setDate(
    nextRevisionDate.getDate() + daysToAdd
  );

  await prisma.revision.update({
    where: {
      id,
    },
    data: {
      revisionCount: {
        increment: 1,
      },
      nextRevision: nextRevisionDate,
    },
  });

  revalidatePath("/revision");
  revalidatePath("/dashboard");
}