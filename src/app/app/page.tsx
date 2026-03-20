// TEMP: participant home screen.
// Replace static content with final product UI and full activity logic later.

import { getSession } from "@/lib/getSession";
import { prisma } from "@/lib/db";
import { calculatePregnancyWeek } from "@/lib/pregnancy";
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

  return (
    <main className="min-h-screen bg-[#f7f3ef] px-4 py-6 text-[#4b4a46]">
      <div className="mx-auto max-w-sm">
        <section className="mb-5 border-b border-[#d9d2ca] pb-5 text-center">
          <h1 className="font-serif text-4xl font-semibold tracking-tight text-[#4f4a46]">
            good morning
          </h1>
          <p className="mt-3 text-[15px] text-[#61725f]">
            you're in week{" "}
            <button className="border-b border-[#61725f] leading-none">
              {pregnancyWeek}
            </button>
          </p>
        </section>

        <section className="mb-5">
          <div className="grid grid-cols-2 overflow-hidden rounded-2xl border border-[#d9d2ca] bg-[#fbf8f5] shadow-sm">
            <button className="bg-[#eef0ea] px-4 py-4 text-lg text-[#546553]">
              Morning breathing
            </button>
            <button className="border-l border-[#d9d2ca] bg-[#fbf8f5] px-4 py-4 text-lg text-[#5d5b57]">
              Night breathing
            </button>
          </div>
        </section>

        <section className="mb-5 rounded-3xl border border-[#d9d2ca] bg-[#fbf8f5] p-4 shadow-sm">
          <h2 className="mb-4 text-center font-serif text-4xl font-semibold text-[#4f4a46]">
            Weekly Task
          </h2>

          <div className="mb-4 rounded-2xl bg-[#f1ece5] px-4 py-3 text-center text-lg text-[#5a6a57]">
            Preparing for overwhelming moments
          </div>

          <div className="relative overflow-hidden rounded-[28px] bg-[#f6efe7] p-4">
            <div className="flex min-h-[220px] items-center justify-center text-[#8b857f]">
              TEMP weekly task content
            </div>

            <button className="absolute bottom-5 right-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#f3f1eb] shadow-md transition hover:scale-105">
              <span className="ml-1 text-2xl text-[#6b7e68]">▶</span>
            </button>
          </div>
        </section>

        <section className="rounded-3xl border border-[#d9d2ca] bg-[#fbf8f5] p-4 shadow-sm">
          <h3 className="mb-3 font-serif text-2xl font-semibold text-[#4f4a46]">
            Test Preparations
          </h3>

          <button className="flex w-full items-center justify-between rounded-2xl bg-white px-4 py-4 text-left shadow-sm ring-1 ring-[#ece4dc]">
            <div>
              <p className="text-lg text-[#4f4a46]">
                Preparing for the second trimester scan
              </p>
              <p className="mt-1 text-base text-[#6b6a66]">Weeks 19–22</p>
            </div>
            <span className="text-3xl text-[#6b6a66]">›</span>
          </button>
        </section>
      </div>
    </main>
  );
}
