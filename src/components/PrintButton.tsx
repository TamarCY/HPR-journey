"use client";

export default function PrintButton() {
  const handlePrint = () => {
    fetch("/api/log-event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ eventType: "DOCTOR_FORM_PRINTED" }),
    });
    window.print();
  };

  return (
    <button
      type="button"
      onClick={handlePrint}
      className="w-full rounded-lg bg-white px-3 py-2 text-sm text-[#4f4a46] ring-1 ring-[#ece4dc]"
    >
      Print
    </button>
  );
}
