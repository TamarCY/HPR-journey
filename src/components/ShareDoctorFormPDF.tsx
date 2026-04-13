"use client";

import jsPDF from "jspdf";

type Props = {
  text: string;
};

export default function ShareDoctorFormPDF({ text }: Props) {
  const handleShare = async () => {
    const doc = new jsPDF();
    const lines = doc.splitTextToSize(text, 180);

    doc.text(lines, 15, 20);

    const blob = doc.output("blob");

    const file = new File([blob], "patient-care-request.pdf", {
      type: "application/pdf",
    });

    if (navigator.share && navigator.canShare?.({ files: [file] })) {
      await navigator.share({
        files: [file],
        title: "Patient Care Request",
      });

      fetch("/api/log-event", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventType: "DOCTOR_FORM_PDF_SHARED" }),
      });
    } else {
      alert("Sharing not supported on this device");
    }
  };

  return (
    <button
      type="button"
      onClick={handleShare}
      className="w-full rounded-lg bg-white px-3 py-2 text-sm text-[#4f4a46] ring-1 ring-[#ece4dc]"
    >
      Share
    </button>
  );
}
