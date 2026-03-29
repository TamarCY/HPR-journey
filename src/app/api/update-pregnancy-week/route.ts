import { NextResponse } from "next/server";

import { prisma } from "@/lib/db";
import { getSession } from "@/lib/getSession";
import { getBostonDateOnly } from "@/lib/dates";

export async function POST(request: Request) {
  const session = await getSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { week } = await request.json();

  const weekNumber = Number(week);

  if (!weekNumber || weekNumber < 1 || weekNumber > 42) {
    return NextResponse.json({ error: "Week must be between 1 and 42" }, { status: 400 });
  }

  const todayBoston = getBostonDateOnly();

  const gestationalAnchorDate = new Date(todayBoston);
  gestationalAnchorDate.setDate(gestationalAnchorDate.getDate() - ((weekNumber - 1) * 7 + 1));

  await prisma.participant.update({
    where: { id: session.participantId },
    data: {
      gestationalAnchorDate,
      datingMethod: "MANUAL_EDIT",
      lastManualWeekEditAt: new Date(),
    },
  });

  return NextResponse.json({ success: true });
}
