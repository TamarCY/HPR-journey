// TEMP: API route for saving participant EDD during onboarding.

import { prisma } from "@/lib/db";
import { getSession } from "@/lib/getSession";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const session = await getSession();

  if (!session) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { edd } = await request.json();

  await prisma.participant.update({
    where: { id: session.participantId },
    data: {
      eddDate: new Date(edd),
    },
  });

  return NextResponse.json({ success: true });
}
