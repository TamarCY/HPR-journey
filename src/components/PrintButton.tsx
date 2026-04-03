"use client";

export default function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="rounded-xl bg-black px-4 py-2 text-white"
    >
      Print / Save as PDF
    </button>
  );
}
