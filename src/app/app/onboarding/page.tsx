// TEMP: onboarding page for MVP.
// Replace after final design and onboarding flow are implemented.

"use client";

import { useState } from "react";

export default function OnboardingPage() {
  const [edd, setEdd] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const res = await fetch("/api/set-edd", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ edd }),
    });

    setLoading(false);

    if (res.ok) {
      window.location.href = "/app";
    } else {
      alert("Failed to save EDD");
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-pink-50 via-white to-rose-50 px-6 py-10">
      <div className="mx-auto max-w-md">
        <div className="mb-8 text-center">
          <p className="mb-2 text-sm font-medium uppercase tracking-[0.2em] text-rose-400">
            TEMP MVP FLOW
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-gray-900">Welcome</h1>
          <p className="mt-3 text-base text-gray-600">
            Before we begin, we need one small detail.
          </p>
        </div>

        <div className="rounded-3xl border border-white/70 bg-white/90 p-6 shadow-[0_20px_60px_-20px_rgba(244,114,182,0.25)] backdrop-blur">
          <div className="mb-5">
            <div className="mb-3 inline-flex rounded-full bg-rose-100 px-3 py-1 text-sm font-medium text-rose-600">
              Step 1 of 1
            </div>
            <h2 className="text-xl font-semibold text-gray-900">
              When is your baby’s due date?
            </h2>
            <p className="mt-2 text-sm leading-6 text-gray-600">
              Please select your estimated due date so we can personalize your experience.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="edd"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Estimated due date
              </label>
              <input
                id="edd"
                type="date"
                value={edd}
                onChange={(e) => setEdd(e.target.value)}
                required
                className="w-full rounded-2xl border border-rose-200 bg-white px-4 py-3 text-gray-900 shadow-sm outline-none transition focus:border-rose-400 focus:ring-4 focus:ring-rose-100"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-gray-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Saving..." : "Continue"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
