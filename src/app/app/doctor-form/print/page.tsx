import Link from "next/link";
import { redirect } from "next/navigation";
import { EventType } from "@prisma/client";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/getSession";
import { logEvent } from "@/lib/logEvent";
import { calculatePregnancyWeek } from "@/lib/pregnancy";
import PrintButton from "@/components/PrintButton";
import DownloadDoctorFormPDF from "@/components/DownloadDoctorFormPDF";
import SaveDoctorFormPDF from "@/components/SaveDoctorFormPDF";
import ShareDoctorFormPDF from "@/components/ShareDoctorFormPDF";

export default async function DoctorFormPrintPage() {
  const session = await getSession();

  if (!session) redirect("/unauthorized");

  const participant = await prisma.participant.findUnique({
    where: { id: session.participantId },
  });

  if (!participant) redirect("/unauthorized");

  const pregnancyWeek = participant.gestationalAnchorDate
    ? calculatePregnancyWeek(participant.gestationalAnchorDate)
    : null;

  await logEvent({
    participantId: session.participantId,
    eventType: EventType.DOCTOR_FORM_PREVIEWED,
    pregnancyWeek,
  });

  const form = participant.doctorFormJson as {
    explainBeforeTouching?: boolean;
    avoidTouchingAreas?: boolean;
    preferFemaleClinician?: boolean;
    allowSupportPerson?: boolean;
    notes?: string;
  } | null;

  const printableText = `Patient Care Request

This patient has requested the following trauma-informed care preferences:

${form?.explainBeforeTouching ? "• Please explain before touching.\n" : ""}${
    form?.avoidTouchingAreas
      ? "• Please avoid touching sensitive areas unless necessary.\n"
      : ""
  }${
    form?.preferFemaleClinician
      ? "• The patient prefers a female clinician if possible.\n"
      : ""
  }${
    form?.allowSupportPerson
      ? "• The patient would like to allow a support person.\n"
      : ""
  }

${form?.notes ? `Additional notes:\n${form.notes}\n\n` : ""}Thank you for supporting trauma-informed care.`;

  return (
    <main className="min-h-screen bg-white px-6 py-8 text-black">
      <div className="mx-auto max-w-2xl">
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

        <p className="mt-6 text-xs text-gray-500">
          Generated on {new Date().toLocaleDateString()}
        </p>

        <div className="mt-8 flex gap-2 print:hidden">
          <Link
            href="/app/doctor-form"
            className="flex-1 rounded-lg bg-white px-3 py-2 text-center text-sm ring-1 ring-[#ece4dc]"
          >
            Edit
          </Link>

          <PrintButton />

          <SaveDoctorFormPDF text={printableText} />

          <ShareDoctorFormPDF text={printableText} />
        </div>
      </div>
    </main>
  );
}
