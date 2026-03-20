import { prisma } from "@/lib/db";
import { getSession } from "@/lib/getSession";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const session = await getSession();

  if (!session) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const body = await request.json();
  const { method, value } = body;

  const today = new Date();

  let gestationalAnchorDate: Date | null = null;

  const data: any = {
    onboardingCompletedAt: new Date(),
    status: "ACTIVE",
  };

  // 👉 WEEK
  if (method === "WEEK") {
    const week = Number(value);

    if (!week || week < 1 || week > 42) {
      return NextResponse.json(
        { error: "Week must be between 1 and 42" },
        { status: 400 },
      );
    }

    gestationalAnchorDate = new Date(today);
    gestationalAnchorDate.setDate(today.getDate() - (week - 1) * 7);

    data.weekAtOnboarding = week;
    data.onboardingDate = today;
    data.datingMethod = "WEEK_AT_ONBOARDING";
  }

  // 👉 EDD
  if (method === "EDD") {
    const eddDate = new Date(value);

    if (isNaN(eddDate.getTime())) {
      return NextResponse.json({ error: "Invalid EDD date" }, { status: 400 });
    }

    if (eddDate <= today) {
      return NextResponse.json({ error: "EDD must be in the future" }, { status: 400 });
    }

    gestationalAnchorDate = new Date(eddDate);
    gestationalAnchorDate.setDate(gestationalAnchorDate.getDate() - 280);

    data.eddDate = eddDate;
    data.datingMethod = "EDD";
  }

  // 👉 LMP
  if (method === "LMP") {
    const lmpDate = new Date(value);

    if (isNaN(lmpDate.getTime())) {
      return NextResponse.json({ error: "Invalid LMP date" }, { status: 400 });
    }

    const diffDays = (today.getTime() - lmpDate.getTime()) / (1000 * 60 * 60 * 24);

    if (diffDays < 0) {
      return NextResponse.json({ error: "LMP cannot be in the future" }, { status: 400 });
    }

    if (diffDays > 300) {
      return NextResponse.json({ error: "LMP too far in the past" }, { status: 400 });
    }

    gestationalAnchorDate = lmpDate;

    data.lmpDate = lmpDate;
    data.datingMethod = "LMP";
  }

  if (!gestationalAnchorDate) {
    return NextResponse.json({ error: "Invalid method" }, { status: 400 });
  }

  data.gestationalAnchorDate = gestationalAnchorDate;

  await prisma.participant.update({
    where: { id: session.participantId },
    data,
  });

  return NextResponse.json({ success: true });
}
