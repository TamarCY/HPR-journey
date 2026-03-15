import { prisma } from "@/lib/db";
import { createParticipantToken } from "@/lib/tokens";
import { NextResponse } from "next/server";

export async function POST() {
  const participant = await prisma.participant.findFirst();

  if (!participant) {
    return NextResponse.json({ error: "No participant found" }, { status: 404 });
  }

  const result = await createParticipantToken({
    participantId: participant.id,
    baseUrl: "http://localhost:3000",
  });

  return NextResponse.json(result);
}
