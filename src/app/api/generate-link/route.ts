import crypto from "crypto";
import { NextResponse } from "next/server";

import { prisma } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const { participantId } = await request.json();

    if (!participantId) {
      return NextResponse.json({ error: "participantId is required" }, { status: 400 });
    }

    const participant = await prisma.participant.findUnique({
      where: { id: participantId },
    });

    if (!participant) {
      return NextResponse.json({ error: "Participant not found" }, { status: 404 });
    }

    const token = crypto.randomBytes(32).toString("hex");
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

    await prisma.participantToken.create({
      data: {
        participantId,
        tokenHash,
        isActive: true,
      },
    });

    const baseUrl = new URL(request.url).origin;
    const personalUrl = `${baseUrl}/t/${token}`;

    return NextResponse.json({
      participantId,
      personalUrl,
    });
  } catch (error) {
    console.error("Failed to generate participant link:", error);

    return NextResponse.json(
      { error: "Failed to generate participant link" },
      { status: 500 },
    );
  }
}

/*how to use:
From Prisma Studio, copy the participant id.
 local:
curl -X POST http://localhost:3000/api/generate-link \
  -H "Content-Type: application/json" \
  -d '{"participantId":"170a3b1a-535e-4ba8-8d66-8def6fa11082"}'

  prod:
  curl -X POST https://hpr-journey-app.vercel.app/api/generate-link \
  -H "Content-Type: application/json" \
  -d '{"participantId":"6440f828-8e0a-44ec-aad8-8b6d94d5dc34"}'*/
