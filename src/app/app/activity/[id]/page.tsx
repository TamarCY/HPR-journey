import Link from "next/link";
import { redirect } from "next/navigation";
import { ActivityType, CompletionSource } from "@prisma/client";

import { prisma } from "@/lib/db";
import { getSession } from "@/lib/getSession";
import { calculateStudyWeek } from "@/lib/studyWeek";
import { getBostonDateOnly } from "@/lib/dates";
import ActivityMediaPlayer from "@/components/ActivityMediaPlayer";

export default async function ActivityPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getSession();

  if (!session) {
    redirect("/unauthorized");
  }

  const { id } = await params;

  const activity = await prisma.activity.findUnique({
    where: { id },
  });

  if (!activity) {
    redirect("/app");
  }

  const participant = await prisma.participant.findUnique({
    where: { id: session.participantId },
  });

  if (!participant) {
    redirect("/unauthorized");
  }

  const studyStart = participant.studyStartedAt ?? participant.onboardingCompletedAt;

  if (!studyStart) {
    redirect("/app/onboarding");
  }

  const studyWeek = calculateStudyWeek(studyStart);
  const todayBoston = getBostonDateOnly();

  const progress = await prisma.activityProgress.findFirst({
    where: {
      participantId: session.participantId,
      activityId: activity.id,
      ...(activity.type === ActivityType.BREATHING ? { progressDate: todayBoston } : {}),
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const isCompleted = !!progress?.completedAt;

  return (
    <main className="min-h-screen bg-[#f7f3ef] px-5 py-6 text-[#4f4a46]">
      <div className="mx-auto max-w-sm space-y-5 pb-24">
        <Link href="/app" className="inline-block text-sm text-[#6d6661]">
          ← Back
        </Link>

        <div className="rounded-[28px] bg-[#fbf8f5] px-6 py-8 shadow-sm ring-1 ring-[#ece4dc]">
          <h1 className="font-serif text-[2rem] font-semibold leading-tight text-[#586b56]">
            {activity.title}
          </h1>

          {activity.subtitle && (
            <p className="mt-3 text-[0.98rem] leading-7 text-[#6d6661]">
              {activity.subtitle}
            </p>
          )}

          {activity.imageUrl && (
            <div className="mt-5 overflow-hidden rounded-[24px] bg-[#f6efe7]">
              <img
                src={activity.imageUrl}
                alt={activity.title}
                className="h-auto w-full object-cover"
              />
            </div>
          )}

          {(activity.videoUrl || activity.audioUrl) && (
            <div className="mt-5">
              <ActivityMediaPlayer
                activityId={activity.id}
                videoUrl={activity.videoUrl}
                audioUrl={activity.audioUrl}
              />
            </div>
          )}

          {activity.contentText && (
            <div className="mt-5 rounded-[24px] bg-[#f6efe7] p-5">
              <div
                className="space-y-3 text-[0.98rem] leading-7 text-[#6d6661] [&_ul]:list-disc [&_ul]:pl-5"
                dangerouslySetInnerHTML={{ __html: activity.contentText }}
              />
            </div>
          )}

          {!activity.videoUrl && !activity.audioUrl && !activity.contentText && (
            <div className="mt-5 rounded-[24px] bg-[#f6efe7] p-5 text-sm text-[#8b857f]">
              No activity content available yet.
            </div>
          )}
        </div>

        {activity.type === ActivityType.WEEKLY && (
          <Link
            href="/app/past-tasks"
            className="mt-4 block rounded-xl bg-white px-4 py-3 text-center text-base font-medium text-[#6d6661] shadow-sm ring-1 ring-[#ece4dc] hover:opacity-95"
          >
            View Past Tasks
          </Link>
        )}

        <form
          action={async () => {
            "use server";

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
                await prisma.activityProgress.update({
                  where: { id: existingProgress.id },
                  data: {
                    completedAt: now,
                    completionSource: CompletionSource.FINISHED_BUTTON,
                  },
                });
              } else {
                await prisma.activityProgress.create({
                  data: {
                    participantId: session.participantId,
                    activityId: activity.id,
                    progressDate: todayBoston,
                    startedAt: now,
                    completedAt: now,
                    completionSource: CompletionSource.FINISHED_BUTTON,
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
                await prisma.activityProgress.update({
                  where: { id: existingProgress.id },
                  data: {
                    completedAt: now,
                    assignedStudyWeek:
                      activity.type === ActivityType.WEEKLY ? activity.studyWeek : null,
                    completedStudyWeek:
                      activity.type === ActivityType.WEEKLY ? studyWeek : null,
                    completionSource: CompletionSource.FINISHED_BUTTON,
                  },
                });
              } else {
                await prisma.activityProgress.create({
                  data: {
                    participantId: session.participantId,
                    activityId: activity.id,
                    startedAt: now,
                    completedAt: now,
                    assignedStudyWeek:
                      activity.type === ActivityType.WEEKLY ? activity.studyWeek : null,
                    completedStudyWeek:
                      activity.type === ActivityType.WEEKLY ? studyWeek : null,
                    completionSource: CompletionSource.FINISHED_BUTTON,
                  },
                });
              }
            }

            redirect("/app");
          }}
          className="mt-6"
        >
          <button
            type="submit"
            disabled={isCompleted}
            className={`w-full rounded-xl px-4 py-3 text-base font-medium shadow-sm transition ${
              isCompleted
                ? "bg-[#cfd8cc] text-white"
                : "bg-[#6b8e6a] text-white hover:bg-[#5f815f]"
            }`}
          >
            {isCompleted ? "✓ Completed" : "Mark as Completed"}
          </button>
        </form>

        {activity.contentText && (
          <Link
            href="/app/doctor-form"
            className="mt-4 block rounded-xl bg-white px-4 py-3 text-center shadow-sm"
          >
            Request for Doctor
          </Link>
        )}
      </div>
    </main>
  );
}
