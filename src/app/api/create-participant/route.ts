// TEMP: create participant + personal access link

import { prisma } from "@/lib/db";
import { createParticipantToken } from "@/lib/tokens";
import { NextResponse } from "next/server";

export async function POST() {
  // create participant
  const participant = await prisma.participant.create({
    data: {
      studyNumber: Math.floor(Math.random() * 100000),
    },
  });

  // generate token + personal link
  const { personalUrl } = await createParticipantToken({
    participantId: participant.id,
    baseUrl: "http://localhost:3000",
  });

  return NextResponse.json({
    participantId: participant.id,
    link: personalUrl,
  });
}
