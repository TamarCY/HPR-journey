import { NextResponse } from "next/server";
import { ActivityType, CompletionSource } from "@prisma/client";

import { prisma } from "@/lib/db";
import { getSession } from "@/lib/getSession";
import { calculateStudyWeek } from "@/lib/studyWeek";
import { getBostonDateOnly } from "@/lib/dates";

export async function POST(request: Request) {
  const session = await getSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { activityId, completionSource } = await request.json();

  if (!activityId) {
    return NextResponse.json({ error: "Missing activityId" }, { status: 400 });
  }

  const activity = await prisma.activity.findUnique({
    where: { id: activityId },
  });

  if (!activity) {
    return NextResponse.json({ error: "Activity not found" }, { status: 404 });
  }

  const participant = await prisma.participant.findUnique({
    where: { id: session.participantId },
  });

  if (!participant) {
    return NextResponse.json({ error: "Participant not found" }, { status: 404 });
  }

  const studyStart = participant.studyStartedAt ?? participant.onboardingCompletedAt;

  if (!studyStart) {
    return NextResponse.json(
      { error: "Participant has no study start date" },
      { status: 400 },
    );
  }

  const studyWeek = calculateStudyWeek(studyStart);
  const todayBoston = getBostonDateOnly();
  const now = new Date();

  if (activity.type === ActivityType.BREATHING) {
    const existingProgress = await prisma.activityProgress.findFirst({
      where: {
        participantId: session.participantId,
        activityId: activity.id,
        progressDate: todayBoston,
      },
      orderBy: { createdAt: "desc" },
    });

    if (existingProgress) {
      if (!existingProgress.completedAt) {
        await prisma.activityProgress.update({
          where: { id: existingProgress.id },
          data: {
            completedAt: now,
            completionSource,
          },
        });
      }
    } else {
      await prisma.activityProgress.create({
        data: {
          participantId: session.participantId,
          activityId: activity.id,
          progressDate: todayBoston,
          startedAt: now,
          completedAt: now,
          completionSource,
        },
      });
    }
  } else {
    const existingProgress = await prisma.activityProgress.findFirst({
      where: {
        participantId: session.participantId,
        activityId: activity.id,
      },
      orderBy: { createdAt: "desc" },
    });

    if (existingProgress) {
      if (!existingProgress.completedAt) {
        await prisma.activityProgress.update({
          where: { id: existingProgress.id },
          data: {
            completedAt: now,
            completionSource,
            assignedStudyWeek:
              activity.type === ActivityType.WEEKLY ? activity.studyWeek : null,
            completedStudyWeek: activity.type === ActivityType.WEEKLY ? studyWeek : null,
          },
        });
      }
    } else {
      await prisma.activityProgress.create({
        data: {
          participantId: session.participantId,
          activityId: activity.id,
          startedAt: now,
          completedAt: now,
          completionSource,
          assignedStudyWeek:
            activity.type === ActivityType.WEEKLY ? activity.studyWeek : null,
          completedStudyWeek: activity.type === ActivityType.WEEKLY ? studyWeek : null,
        },
      });
    }
  }

  return NextResponse.json({ success: true });
}
