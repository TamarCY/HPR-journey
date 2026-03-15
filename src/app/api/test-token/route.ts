import { prisma } from "@/lib/db";
import { createParticipantToken } from "@/lib/tokens";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const participant = await prisma.participant.findFirst();

  if (!participant) {
    return NextResponse.json({ error: "No participant found" }, { status: 404 });
  }

  const baseUrl = new URL(request.url).origin;

  const result = await createParticipantToken({
    participantId: participant.id,
    baseUrl,
  });

  return NextResponse.json(result);
}
