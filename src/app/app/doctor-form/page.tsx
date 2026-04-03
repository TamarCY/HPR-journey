import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/getSession";

export default async function DoctorFormPage() {
  const session = await getSession();

  if (!session) redirect("/unauthorized");

  const participant = await prisma.participant.findUnique({
    where: { id: session.participantId },
  });

  if (!participant) redirect("/unauthorized");

  const existing = participant.doctorFormJson as any;

  return (
    <main className="min-h-screen bg-[#f7f3ef] px-5 py-6">
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
        className="mx-auto max-w-sm space-y-5"
      >
        <h1 className="text-xl font-semibold">Doctor Request</h1>

        <label className="flex gap-3">
          <input
            type="checkbox"
            name="explainBeforeTouching"
            defaultChecked={existing?.explainBeforeTouching}
          />
          Explain before touching
        </label>

        <label className="flex gap-3">
          <input
            type="checkbox"
            name="avoidTouchingAreas"
            defaultChecked={existing?.avoidTouchingAreas}
          />
          Avoid touching sensitive areas
        </label>

        <label className="flex gap-3">
          <input
            type="checkbox"
            name="preferFemaleClinician"
            defaultChecked={existing?.preferFemaleClinician}
          />
          Prefer female clinician
        </label>

        <label className="flex gap-3">
          <input
            type="checkbox"
            name="allowSupportPerson"
            defaultChecked={existing?.allowSupportPerson}
          />
          Allow support person
        </label>

        <textarea
          name="notes"
          placeholder="Additional notes..."
          defaultValue={existing?.notes}
          className="w-full rounded-lg border p-3"
        />

        <button className="w-full rounded-xl bg-[#6b8e6a] py-3 text-white">Save</button>
      </form>
    </main>
  );
}
