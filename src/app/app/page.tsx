// TEMP: home screen connected to DB activities

import Link from "next/link";
import { getSession } from "@/lib/getSession";
import { prisma } from "@/lib/db";
import { calculatePregnancyWeek } from "@/lib/pregnancy";
import { ActivityType, BreathingSlot } from "@prisma/client";
import { redirect } from "next/navigation";

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

  const pregnancyWeek = calculatePregnancyWeek(participant.gestationalAnchorDate);

  // 🔥 REAL DATA FROM DB

  const morningBreathing = await prisma.activity.findFirst({
    where: {
      type: ActivityType.BREATHING,
      breathingSlot: BreathingSlot.MORNING,
      isActive: true,
    },
  });

  const nightBreathing = await prisma.activity.findFirst({
    where: {
      type: ActivityType.BREATHING,
      breathingSlot: BreathingSlot.NIGHT,
      isActive: true,
    },
  });

  const weeklyTask = await prisma.activity.findFirst({
    where: {
      type: ActivityType.WEEKLY,
      isActive: true,
      minPregnancyWeek: { lte: pregnancyWeek },
      maxPregnancyWeek: { gte: pregnancyWeek },
    },
  });

  const testPrepTask = await prisma.activity.findFirst({
    where: {
      type: ActivityType.TEST_PREP,
      isActive: true,
      minPregnancyWeek: { lte: pregnancyWeek },
      maxPregnancyWeek: { gte: pregnancyWeek },
    },
  });

  return (
    <main className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Week {pregnancyWeek}</h1>

      {/* Breathing */}
      <div className="grid grid-cols-2 gap-4">
        {morningBreathing && (
          <Link href={`/app/activity/${morningBreathing.id}`}>
            <div className="p-4 bg-gray-100 rounded-xl">{morningBreathing.title}</div>
          </Link>
        )}

        {nightBreathing && (
          <Link href={`/app/activity/${nightBreathing.id}`}>
            <div className="p-4 bg-gray-100 rounded-xl">{nightBreathing.title}</div>
          </Link>
        )}
      </div>

      {/* Weekly */}
      {weeklyTask && (
        <Link href={`/app/activity/${weeklyTask.id}`}>
          <div className="p-6 bg-blue-100 rounded-xl">
            <h2 className="text-xl font-semibold">{weeklyTask.title}</h2>
            <p>{weeklyTask.subtitle}</p>
          </div>
        </Link>
      )}

      {/* Test Prep */}
      {testPrepTask && (
        <Link href={`/app/activity/${testPrepTask.id}`}>
          <div className="p-4 bg-green-100 rounded-xl">{testPrepTask.title}</div>
        </Link>
      )}
    </main>
  );
}
