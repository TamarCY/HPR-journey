import { NextResponse } from "next/server";

import { prisma } from "@/lib/db";
import { getSession } from "@/lib/getSession";

export async function POST(request: Request) {
  const session = await getSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { activityId } = await request.json();

  if (!activityId) {
    return NextResponse.json({ error: "Missing activityId" }, { status: 400 });
  }

  const existingProgress = await prisma.activityProgress.findFirst({
    where: {
      participantId: session.participantId,
      activityId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  if (existingProgress) {
    await prisma.activityProgress.update({
      where: { id: existingProgress.id },
      data: {
        completedAt: new Date(),
      },
    });
  } else {
    await prisma.activityProgress.create({
      data: {
        participantId: session.participantId,
        activityId,
        completedAt: new Date(),
      },
    });
  }

  return NextResponse.json({ success: true });
}
