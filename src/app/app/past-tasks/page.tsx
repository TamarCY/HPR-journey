import Link from "next/link";
import { redirect } from "next/navigation";
import { ActivityType } from "@prisma/client";

import { getSession } from "@/lib/getSession";
import { prisma } from "@/lib/db";
import { calculateStudyWeek } from "@/lib/studyWeek";

export default async function PastTasksPage() {
  const session = await getSession();

  if (!session) {
    redirect("/unauthorized");
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

  const pastWeeklyTasks = await prisma.activity.findMany({
    where: {
      type: ActivityType.WEEKLY,
      isActive: true,
      studyWeek: {
        lt: studyWeek,
      },
    },
    orderBy: {
      studyWeek: "desc",
    },
    select: {
      id: true,
      title: true,
      subtitle: true,
      studyWeek: true,
    },
  });

  return (
    <main className="min-h-screen bg-[#f7f3ef] px-5 py-6 text-[#4f4a46]">
      <div className="mx-auto max-w-sm space-y-5">
        <Link href="/app" className="inline-block text-sm text-[#6d6661]">
          ← Back
        </Link>

        <section className="rounded-[24px] bg-[#fbf8f5] p-4 shadow-sm ring-1 ring-[#ece4dc]">
          <h1 className="font-serif text-[1.8rem] font-semibold text-[#4f4a46]">
            Past Tasks
          </h1>

          {pastWeeklyTasks.length > 0 ? (
            <div className="mt-4 space-y-3">
              {pastWeeklyTasks.map((task) => (
                <Link
                  key={task.id}
                  href={`/app/activity/${task.id}`}
                  className="flex items-center justify-between rounded-2xl bg-white px-4 py-4 shadow-sm ring-1 ring-[#ece4dc] transition hover:opacity-95"
                >
                  <div>
                    <p className="text-[1rem] text-[#4f4a46]">{task.title}</p>

                    {task.subtitle && (
                      <p className="mt-1 text-sm text-[#6d6661]">{task.subtitle}</p>
                    )}

                    {task.studyWeek && (
                      <p className="mt-1 text-xs text-[#9c948d]">
                        Study week {task.studyWeek}
                      </p>
                    )}
                  </div>

                  <span className="text-2xl text-[#6d6661]">›</span>
                </Link>
              ))}
            </div>
          ) : (
            <p className="mt-4 text-sm text-[#6d6661]">No past tasks available yet.</p>
          )}
        </section>
      </div>
    </main>
  );
}
