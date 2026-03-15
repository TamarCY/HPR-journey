// TEMP: token entry route for MVP.
// Validates participant token, creates session, and redirects to onboarding or app.

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
    secure: false, // TEMP: use true in production with HTTPS
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  const redirectPath = participantToken.participant.eddDate ? "/app" : "/app/onboarding";

  return NextResponse.redirect(new URL(redirectPath, request.url));
}
