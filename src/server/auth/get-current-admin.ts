import "server-only";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function getCurrentAdmin() {
  const session = await auth();

  const userId = session?.user?.id;

  if (!userId) {
    return null;
  }

  return prisma.user.findFirst({
    where: {
      id: userId,
      isActive: true,
    },
    select: {
      id: true,
      email: true,
      name: true,
    },
  });
}
