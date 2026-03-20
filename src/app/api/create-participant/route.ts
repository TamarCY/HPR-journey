// TEMP: create a participant and return a personal access link.
// Replace or protect before real production use.

import { prisma } from "@/lib/db";
import { createParticipantToken } from "@/lib/tokens";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const lastParticipant = await prisma.participant.findFirst({
      orderBy: {
        studyNumber: "desc",
      },
    });

    const nextStudyNumber = lastParticipant ? lastParticipant.studyNumber + 1 : 1;

    const participant = await prisma.participant.create({
      data: {
        studyNumber: nextStudyNumber,
        status: "NOT_STARTED",
      },
    });

    const baseUrl = new URL(request.url).origin;

    const { personalUrl, participantToken } = await createParticipantToken({
      participantId: participant.id,
      baseUrl,
    });

    return NextResponse.json({
      participant: {
        id: participant.id,
        studyNumber: participant.studyNumber,
        status: participant.status,
      },
      token: {
        id: participantToken.id,
      },
      personalUrl,
    });
  } catch (error) {
    console.error("Failed to create participant:", error);

    return NextResponse.json({ error: "Failed to create participant" }, { status: 500 });
  }
}
