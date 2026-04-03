import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/getSession";
import Link from "next/link";

export default async function DoctorFormPage() {
  const session = await getSession();

  if (!session) redirect("/unauthorized");

  const participant = await prisma.participant.findUnique({
    where: { id: session.participantId },
  });

  if (!participant) redirect("/unauthorized");

  const existing = participant.doctorFormJson as any;

  return (
    <main className="min-h-screen bg-[#f7f3ef] px-5 py-6 text-[#4f4a46]">
      <form
        action={async (formData) => {
          "use server";

          await prisma.participant.update({
            where: { id: session.participantId },
            data: {
              doctorFormJson: {
                explainBeforeTouching: formData.get("explainBeforeTouching") === "on",
                avoidTouchingAreas: formData.get("avoidTouchingAreas") === "on",
                preferFemaleClinician: formData.get("preferFemaleClinician") === "on",
                allowSupportPerson: formData.get("allowSupportPerson") === "on",
                notes: String(formData.get("notes") ?? ""),
              },
            },
          });

          redirect("/app");
        }}
        className="mx-auto max-w-sm space-y-5 rounded-[28px] bg-[#fbf8f5] px-6 py-8 shadow-sm ring-1 ring-[#ece4dc]"
      >
        <div className="space-y-2">
          <Link href="/app" className="inline-block text-sm text-[#6d6661]">
            ← Back
          </Link>
          <h1 className="font-serif text-[2rem] font-semibold leading-tight text-[#586b56]">
            Doctor Request
          </h1>
          <p className="text-sm leading-6 text-[#6d6661]">
            Save preferences you would like to share with your doctor.
          </p>
        </div>

        <label className="flex items-start gap-3 rounded-2xl bg-white px-4 py-4 text-[#4f4a46] shadow-sm ring-1 ring-[#ece4dc]">
          <input
            type="checkbox"
            name="explainBeforeTouching"
            defaultChecked={existing?.explainBeforeTouching}
            className="mt-1 h-5 w-5 accent-[#6b8e6a]"
          />
          <span>Explain before touching</span>
        </label>

        <label className="flex items-start gap-3 rounded-2xl bg-white px-4 py-4 text-[#4f4a46] shadow-sm ring-1 ring-[#ece4dc]">
          <input
            type="checkbox"
            name="avoidTouchingAreas"
            defaultChecked={existing?.avoidTouchingAreas}
            className="mt-1 h-5 w-5 accent-[#6b8e6a]"
          />
          <span>Avoid touching sensitive areas</span>
        </label>

        <label className="flex items-start gap-3 rounded-2xl bg-white px-4 py-4 text-[#4f4a46] shadow-sm ring-1 ring-[#ece4dc]">
          <input
            type="checkbox"
            name="preferFemaleClinician"
            defaultChecked={existing?.preferFemaleClinician}
            className="mt-1 h-5 w-5 accent-[#6b8e6a]"
          />
          <span>Prefer female clinician</span>
        </label>

        <label className="flex items-start gap-3 rounded-2xl bg-white px-4 py-4 text-[#4f4a46] shadow-sm ring-1 ring-[#ece4dc]">
          <input
            type="checkbox"
            name="allowSupportPerson"
            defaultChecked={existing?.allowSupportPerson}
            className="mt-1 h-5 w-5 accent-[#6b8e6a]"
          />
          <span>Allow support person</span>
        </label>

        <div className="space-y-2">
          <label htmlFor="notes" className="text-sm font-medium text-[#6d6661]">
            Additional notes
          </label>
          <textarea
            id="notes"
            name="notes"
            placeholder="Add anything you would like your doctor to know..."
            defaultValue={existing?.notes}
            className="min-h-[140px] w-full rounded-2xl border border-[#e5ddd5] bg-white p-4 text-[#4f4a46] placeholder:text-[#a8a19a] shadow-sm outline-none focus:border-[#b7c3ae] focus:ring-2 focus:ring-[#dfe8d8]"
          />
        </div>

        <button className="w-full rounded-xl bg-[#6b8e6a] py-3 text-white shadow-sm transition hover:bg-[#5f815f]">
          Save
        </button>
        <Link
          href="/app/doctor-form/print"
          className="block w-full rounded-xl bg-white px-4 py-3 text-center text-[#4f4a46] shadow-sm ring-1 ring-[#ece4dc] transition hover:opacity-95"
        >
          Export for doctor
        </Link>
      </form>
    </main>
  );
}
