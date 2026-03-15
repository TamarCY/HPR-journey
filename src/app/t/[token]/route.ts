import { prisma } from "@/lib/db";
import { createSession } from "../../../lib/session";
import crypto from "crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ token: string }> },
) {
  const { token } = await params;

  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

  const participantToken = await prisma.participantToken.findUnique({
    where: { tokenHash },
    include: { participant: true },
  });

  if (!participantToken || !participantToken.isActive) {
    return new NextResponse("Invalid or expired token", { status: 401 });
  }

  const session = await createSession(participantToken.participantId);

  const cookieStore = await cookies();

  cookieStore.set("participant_session", session.id, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return NextResponse.redirect(new URL("/app", request.url));
}
