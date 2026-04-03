"use client";

import jsPDF from "jspdf";

type Props = {
  text: string;
};

export default function DownloadDoctorFormPDF({ text }: Props) {
  const generatePDF = () => {
    const doc = new jsPDF();
    const lines = doc.splitTextToSize(text, 180);

    doc.setFontSize(12);
    doc.text(lines, 15, 20);

    return doc.output("blob");
  };

  const handleClick = async () => {
    const blob = generatePDF();
    const file = new File([blob], "patient-care-request.pdf", {
      type: "application/pdf",
    });

    // share if supported
    if (navigator.share && navigator.canShare?.({ files: [file] })) {
      await navigator.share({
        title: "Patient Care Request",
        files: [file],
      });
      return;
    }

    // fallback: download
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "patient-care-request.pdf";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="w-full rounded-lg bg-white px-3 py-2 text-sm text-[#4f4a46] ring-1 ring-[#ece4dc]"
    >
      Share PDF
    </button>
  );
}
