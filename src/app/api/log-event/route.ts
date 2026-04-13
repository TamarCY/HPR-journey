import { NextResponse } from "next/server";
import { EventType } from "@prisma/client";

import { prisma } from "@/lib/db";
import { getSession } from "@/lib/getSession";
import { calculatePregnancyWeek } from "@/lib/pregnancy";
import { logEvent } from "@/lib/logEvent";

export async function POST(request: Request) {
  const session = await getSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { eventType, activityId, metadata } = body;

  if (!eventType || !Object.values(EventType).includes(eventType as EventType)) {
    return NextResponse.json({ error: "Invalid eventType" }, { status: 400 });
  }

  const participant = await prisma.participant.findUnique({
    where: { id: session.participantId },
    select: { gestationalAnchorDate: true },
  });

  const pregnancyWeek = participant?.gestationalAnchorDate
    ? calculatePregnancyWeek(participant.gestationalAnchorDate)
    : null;

  await logEvent({
    participantId: session.participantId,
    eventType: eventType as EventType,
    pregnancyWeek,
    activityId: activityId ?? null,
    metadata: metadata ?? undefined,
  });

  return NextResponse.json({ success: true });
}
