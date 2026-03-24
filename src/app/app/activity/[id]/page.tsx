import Link from "next/link";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/db";
import { getSession } from "@/lib/getSession";

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

  const progress = await prisma.activityProgress.findFirst({
    where: {
      participantId: session.participantId,
      activityId: activity.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const isCompleted = !!progress?.completedAt;

  return (
    <main className="min-h-screen bg-[#f7f3ef] px-5 py-6 text-[#4f4a46]">
      <div className="mx-auto max-w-sm space-y-5 pb-24">
        {/* Back */}
        <Link href="/app" className="inline-block text-sm text-[#6d6661]">
          ← Back
        </Link>

        {/* Card */}
        <div className="rounded-[28px] bg-[#fbf8f5] px-6 py-8 shadow-sm ring-1 ring-[#ece4dc]">
          <h1 className="font-serif text-[2rem] font-semibold leading-tight text-[#586b56]">
            {activity.title}
          </h1>

          {activity.subtitle && (
            <p className="mt-3 text-[0.98rem] leading-7 text-[#6d6661]">
              {activity.subtitle}
            </p>
          )}

          {/* Image */}
          {activity.imageUrl && (
            <div className="mt-5 overflow-hidden rounded-[24px] bg-[#f6efe7]">
              <img
                src={activity.imageUrl}
                alt={activity.title}
                className="h-auto w-full object-cover"
              />
            </div>
          )}

          {/* Video */}
          {activity.videoUrl && (
            <div className="mt-5">
              <video
                key={activity.videoUrl}
                src={activity.videoUrl}
                controls
                playsInline
                muted
                preload="metadata"
                className="w-full rounded-[24px] bg-black"
              >
                Your browser does not support the video tag.
              </video>
            </div>
          )}

          {/* Audio */}
          {activity.audioUrl && (
            <div className="mt-5 rounded-[24px] bg-[#f6efe7] p-4">
              <audio
                src={activity.audioUrl}
                controls
                preload="metadata"
                className="w-full"
              >
                Your browser does not support the audio element.
              </audio>
            </div>
          )}

          {!activity.videoUrl && !activity.audioUrl && !activity.contentText && (
            <div className="mt-5 rounded-[24px] bg-[#f6efe7] p-5 text-sm text-[#8b857f]">
              No activity content available yet.
            </div>
          )}
        </div>
        <form
          action={async () => {
            "use server";

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
                data: { completedAt: new Date() },
              });
            } else {
              await prisma.activityProgress.create({
                data: {
                  participantId: session.participantId,
                  activityId: activity.id,
                  completedAt: new Date(),
                },
              });
            }

            redirect("/app");
          }}
          className="mt-6"
        >
          <button
            type="submit"
            disabled={isCompleted}
            className={`w-full rounded-xl px-4 py-3 text-base font-medium shadow-sm transition
      ${
        isCompleted
          ? "bg-[#cfd8cc] text-white"
          : "bg-[#6b8e6a] text-white hover:bg-[#5f815f]"
      }`}
          >
            {isCompleted ? "✓ Completed" : "Mark as Completed"}
          </button>
        </form>
      </div>
    </main>
  );
}
