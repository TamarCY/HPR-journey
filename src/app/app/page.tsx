// TEMP: home screen connected to DB activities
// Replace or refine later with final design and completion states.

import Link from "next/link";
import { redirect } from "next/navigation";
import { ActivityType, BreathingSlot } from "@prisma/client";

import { getSession } from "@/lib/getSession";
import { prisma } from "@/lib/db";
import { calculatePregnancyWeek, getGreeting } from "@/lib/pregnancy";
import Image from "next/image";
import EditPregnancyWeek from "@/components/EditPregnancyWeek";
import { calculateStudyWeek } from "@/lib/studyWeek";

export default async function AppPage() {
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

  if (!participant.onboardingCompletedAt || !participant.gestationalAnchorDate) {
    redirect("/app/onboarding");
  }

  const studyStart = participant.studyStartedAt ?? participant.onboardingCompletedAt;

  if (!studyStart) {
    redirect("/app/onboarding");
  }

  const studyWeek = calculateStudyWeek(studyStart);

  const pregnancyWeek = calculatePregnancyWeek(participant.gestationalAnchorDate);
  const greeting = getGreeting();

  const morningBreathing = await prisma.activity.findFirst({
    where: {
      type: ActivityType.BREATHING,
      breathingSlot: BreathingSlot.MORNING,
      isActive: true,
    },
    orderBy: {
      orderIndex: "asc",
    },
  });

  const nightBreathing = await prisma.activity.findFirst({
    where: {
      type: ActivityType.BREATHING,
      breathingSlot: BreathingSlot.NIGHT,
      isActive: true,
    },
    orderBy: {
      orderIndex: "asc",
    },
  });

  const weeklyTask = await prisma.activity.findFirst({
    where: {
      type: ActivityType.WEEKLY,
      isActive: true,
      studyWeek,
    },
  });

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
  });

  const testPrepTask = await prisma.activity.findFirst({
    where: {
      type: ActivityType.TEST_PREP,
      isActive: true,
      minPregnancyWeek: { lte: pregnancyWeek },
      maxPregnancyWeek: { gte: pregnancyWeek },
    },
    orderBy: {
      orderIndex: "asc",
    },
  });

  return (
    <main className="min-h-screen bg-[#f7f3ef] px-5 py-6 text-[#4f4a46]">
      <div className="mx-auto max-w-sm space-y-5">
        <section className="text-center">
          <h1 className="font-serif text-[2rem] font-semibold leading-tight text-[#586b56]">
            {greeting}
          </h1>
          <p className="mt-2 text-[1rem] text-[#6d6661]">
            you&apos;re in week <EditPregnancyWeek currentWeek={pregnancyWeek} />
          </p>
          <p className="mt-1 text-sm text-[#9c948d]">Study week {studyWeek}</p>
        </section>

        <section className="grid grid-cols-2 gap-3">
          {morningBreathing ? (
            <Link
              href={`/app/activity/${morningBreathing.id}`}
              className="rounded-2xl bg-[#eef3ea] px-4 py-4 text-center text-[1rem] text-[#586b56] shadow-sm ring-1 ring-[#e2e8dd] transition hover:opacity-95"
            >
              {morningBreathing.title}
            </Link>
          ) : (
            <div className="rounded-2xl bg-[#eef3ea] px-4 py-4 text-center text-[1rem] text-[#586b56] shadow-sm ring-1 ring-[#e2e8dd]">
              Morning breathing
            </div>
          )}

          {nightBreathing ? (
            <Link
              href={`/app/activity/${nightBreathing.id}`}
              className="rounded-2xl bg-[#f3f0ee] px-4 py-4 text-center text-[1rem] text-[#6d6661] shadow-sm ring-1 ring-[#ece4dc] transition hover:opacity-95"
            >
              {nightBreathing.title}
            </Link>
          ) : (
            <div className="rounded-2xl bg-[#f3f0ee] px-4 py-4 text-center text-[1rem] text-[#6d6661] shadow-sm ring-1 ring-[#ece4dc]">
              Night breathing
            </div>
          )}
        </section>

        <section>
          {weeklyTask ? (
            <Link
              href={`/app/activity/${weeklyTask.id}`}
              className="block rounded-[28px] bg-[#e7efe6] p-5 shadow-sm ring-1 ring-[#dde6dc] transition hover:opacity-95"
            >
              <h2 className="font-serif text-[2rem] font-semibold leading-tight text-[#4f4a46]">
                Weekly Task
              </h2>
              {weeklyTask.subtitle && (
                <p className="mt-3 rounded-2xl bg-[#f1ece5] px-4 py-3 text-center text-[0.98rem] leading-6 text-[#6d6661]">
                  {weeklyTask.subtitle}
                </p>
              )}
              <div className="mt-4 flex justify-center">
                <Image
                  src="/task.png"
                  alt="Breathing exercise"
                  width={260}
                  height={260}
                  className="rounded-2xl"
                />
              </div>
              <div className="mt-4 flex justify-end">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-xl text-[#6b8e6a] shadow-md">
                  ▶
                </div>
              </div>
            </Link>
          ) : (
            <div className="rounded-[28px] bg-[#e7efe6] p-5 shadow-sm ring-1 ring-[#dde6dc]">
              <h2 className="font-serif text-[2rem] font-semibold leading-tight text-[#4f4a46]">
                Weekly Task
              </h2>
              <p className="mt-3 text-[0.98rem] text-[#6d6661]">
                No weekly task available
              </p>
            </div>
          )}
        </section>

        <section className="rounded-[24px] bg-[#fbf8f5] p-4 shadow-sm ring-1 ring-[#ece4dc]">
          <h3 className="font-serif text-[1.6rem] font-semibold text-[#4f4a46]">
            Test Preparations
          </h3>

          {testPrepTask ? (
            <Link
              href={`/app/activity/${testPrepTask.id}`}
              className="mt-3 flex items-center justify-between rounded-2xl bg-white px-4 py-4 shadow-sm ring-1 ring-[#ece4dc] transition hover:opacity-95"
            >
              <div>
                <p className="text-[1rem] text-[#4f4a46]">{testPrepTask.title}</p>
                {testPrepTask.subtitle && (
                  <p className="mt-1 text-sm text-[#6d6661]">{testPrepTask.subtitle}</p>
                )}
              </div>
              <span className="text-2xl text-[#6d6661]">›</span>
            </Link>
          ) : (
            <p className="mt-3 text-sm text-[#6d6661]">
              No test preparation task available yet
            </p>
          )}
        </section>
      </div>
    </main>
  );
}
