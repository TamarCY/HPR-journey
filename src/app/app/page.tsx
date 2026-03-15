// TEMP: participant dashboard placeholder.
// Displays today's activity until real activity system is implemented.

import { getSession } from "@/lib/getSession";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";

export default async function AppPage() {
  const session = await getSession();

  if (!session) {
    redirect("/unauthorized");
  }

  const participant = await prisma.participant.findUnique({
    where: { id: session.participantId },
  });

  if (!participant?.eddDate) {
    redirect("/app/onboarding");
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-rose-50 px-6 py-10">
      <div className="mx-auto max-w-md space-y-6">
        <div className="text-center">
          <p className="mb-2 text-sm font-medium uppercase tracking-[0.2em] text-rose-400">
            TEMP DASHBOARD
          </p>
          <p className="mt-3 text-sm leading-6 text-gray-600">
            Your personalized daily activity is ready.
          </p>
        </div>

        <div className="overflow-hidden rounded-3xl border border-white/70 bg-white/90 shadow-[0_20px_60px_-20px_rgba(15,23,42,0.18)] backdrop-blur">
          <div className="bg-gradient-to-r from-rose-100 via-pink-50 to-white p-6">
            <div className="mb-3 inline-flex rounded-full bg-white/80 px-3 py-1 text-sm font-medium text-rose-600">
              Today’s activity
            </div>
            <h2 className="text-2xl font-semibold text-gray-900">
              Gentle Breathing Practice
            </h2>
            <p className="mt-3 text-sm leading-6 text-gray-600">
              Take a few minutes to slow down, breathe, and connect with yourself.
            </p>
          </div>

          <div className="p-6">
            <button className="w-full rounded-2xl bg-gray-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-gray-800">
              Play
            </button>

            <p className="mt-4 text-center text-xs text-gray-400">
              TEMP content — replace with real activity logic later
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
