"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createMistake(
  formData: FormData
) {
  const session = await auth();

  if (!session?.user?.email) {
    throw new Error("Unauthorized");
  }

  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  await prisma.mistakeEntry.create({
    data: {
      userId: user.id,

      subject:
        formData.get("subject") as string,

      topic:
        formData.get("topic") as string,

      question:
        formData.get("question") as string,

      explanation:
        (formData.get("explanation") as string) ||
        null,

      source:
        (formData.get("source") as string) ||
        null,
    },
  });

  revalidatePath("/mistakes");
}

export async function resolveMistake(
  mistakeId: string
) {
  const session = await auth();

  if (!session?.user?.email) {
    throw new Error("Unauthorized");
  }

  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  await prisma.mistakeEntry.update({
    where: {
      id: mistakeId,
    },

    data: {
      resolved: true,
    },
  });

  revalidatePath("/mistakes");
}