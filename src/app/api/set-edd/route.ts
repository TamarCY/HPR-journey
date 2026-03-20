import { prisma } from "@/lib/db";
import { getSession } from "@/lib/getSession";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const session = await getSession();

  if (!session) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { edd } = await request.json();

  const eddDate = new Date(edd);

  // canonical pregnancy anchor = EDD - 280 days
  const gestationalAnchorDate = new Date(eddDate);
  gestationalAnchorDate.setDate(gestationalAnchorDate.getDate() - 280);

  await prisma.participant.update({
    where: { id: session.participantId },
    data: {
      eddDate,
      gestationalAnchorDate,
      onboardingCompletedAt: new Date(),
      status: "ACTIVE",
    },
  });

  return NextResponse.json({ success: true });
}
