"use client";

export default function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="w-full rounded-xl bg-black px-4 py-3 text-white"
    >
      Print / Save as PDF
    </button>
  );
}
