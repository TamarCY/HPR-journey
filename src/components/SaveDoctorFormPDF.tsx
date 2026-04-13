"use client";

import jsPDF from "jspdf";

type Props = {
  text: string;
};

export default function SaveDoctorFormPDF({ text }: Props) {
  const handleSave = () => {
    const doc = new jsPDF();

    const lines = doc.splitTextToSize(text, 180);

    doc.setFontSize(12);
    doc.text(lines, 15, 20);

    doc.save("patient-care-request.pdf");

    fetch("/api/log-event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ eventType: "DOCTOR_FORM_PDF_SAVED" }),
    });
  };

  return (
    <button
      type="button"
      onClick={handleSave}
      className="w-full rounded-lg bg-white px-3 py-2 text-sm text-[#4f4a46] ring-1 ring-[#ece4dc]"
    >
      Save PDF
    </button>
  );
}
