import { prisma } from "@/lib/db";

export async function createSession(participantId: string) {
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  const session = await prisma.session.create({
    data: {
      participantId,
      expiresAt,
    },
  });

  return session;
}
