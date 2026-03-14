import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const participant = await prisma.participant.create({
      data: {},
    });

    return NextResponse.json(participant);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create participant" }, { status: 500 });
  }
}
