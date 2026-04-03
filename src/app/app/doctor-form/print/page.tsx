import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/getSession";
import PrintButton from "@/components/PrintButton";
import ShareDoctorFormButton from "@/components/ShareDoctorFormButton";
import Link from "next/link";

export default async function DoctorFormPrintPage() {
  const session = await getSession();

  if (!session) redirect("/unauthorized");

  const participant = await prisma.participant.findUnique({
    where: { id: session.participantId },
  });

  if (!participant) redirect("/unauthorized");

  const form = participant.doctorFormJson as {
    explainBeforeTouching?: boolean;
    avoidTouchingAreas?: boolean;
    preferFemaleClinician?: boolean;
    allowSupportPerson?: boolean;
    notes?: string;
  } | null;

  return (
    <main className="min-h-screen bg-white px-6 py-8 text-black">
      <div className="mx-auto max-w-2xl">
        <div className="mb-4 print:hidden">
          <Link href="/app/doctor-form" className="text-sm text-gray-600">
            ← Back
          </Link>
        </div>
        <h1 className="text-2xl font-semibold">Patient Care Request</h1>

        <p className="mt-4">
          This patient has requested the following trauma-informed care preferences:
        </p>

        <ul className="mt-4 list-disc space-y-2 pl-6">
          {form?.explainBeforeTouching && <li>Please explain before touching.</li>}
          {form?.avoidTouchingAreas && (
            <li>Please avoid touching sensitive areas unless necessary.</li>
          )}
          {form?.preferFemaleClinician && (
            <li>The patient prefers a female clinician if possible.</li>
          )}
          {form?.allowSupportPerson && (
            <li>The patient would like to allow a support person.</li>
          )}
        </ul>

        {form?.notes && (
          <div className="mt-6">
            <h2 className="text-lg font-semibold">Additional notes</h2>
            <p className="mt-2 whitespace-pre-line">{form.notes}</p>
          </div>
        )}

        <p className="mt-8 text-sm text-gray-600">
          Thank you for supporting trauma-informed care.
        </p>
        <div className="mt-8 flex gap-3 print:hidden">
          <div className="flex-1">
            <PrintButton />
          </div>

          <div className="flex-1">
            <ShareDoctorFormButton />
          </div>
        </div>
      </div>
    </main>
  );
}
