"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

type Method = "EDD" | "LMP" | "WEEK";

export default function OnboardingPage() {
  const router = useRouter();
  const startedLoggedRef = useRef(false);

  useEffect(() => {
    if (startedLoggedRef.current) return;
    startedLoggedRef.current = true;

    fetch("/api/log-event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ eventType: "ONBOARDING_STARTED" }),
    });
  }, []);

  const [method, setMethod] = useState<Method>("EDD");
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/complete-onboarding", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ method, value }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong");
        setLoading(false);
        return;
      }

      router.push("/app");
    } catch {
      setError("Failed to submit onboarding");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f7f3ef] px-5 py-8 text-[#4f4a46]">
      <div className="mx-auto max-w-sm">
        <div className="rounded-[28px] bg-[#fbf8f5] px-6 py-8 shadow-[0_12px_40px_rgba(0,0,0,0.06)] ring-1 ring-[#ece4dc]">
          <h1 className="text-center font-serif text-[2rem] font-semibold leading-tight text-[#586b56]">
            Welcome to the Study!
          </h1>

          <p className="mt-5 text-center text-[1rem] leading-7 text-[#6d6661]">
            Congratulations on choosing to take part in the study! We&apos;re here to help
            and support you throughout your pregnancy.
          </p>

          <div className="mt-6 flex justify-center">
            <div className="mt-4 flex justify-center">
              <Image
                src="/home.png"
                alt="Breathing exercise"
                width={260}
                height={260}
                className="rounded-2xl"
              />
            </div>
          </div>

          <p className="mt-6 text-center text-[0.98rem] leading-7 text-[#6d6661]">
            Our app will provide you with personalized content to help you relax, navigate
            challenging moments, and accomplish tasks throughout your pregnancy, including
            test preparation and guidance for a healthier lifestyle.
          </p>

          <p className="mt-6 text-[0.98rem] leading-7 text-[#6d6661]">
            To tailor the content to your needs, please choose one of the following:
          </p>

          <div className="mt-4">
            <label
              htmlFor="method"
              className="mb-2 block text-left text-sm font-medium text-[#6d6661]"
            >
              Pregnancy information
            </label>

            <select
              id="method"
              value={method}
              onChange={(e) => {
                setMethod(e.target.value as Method);
                setValue("");
                setError("");
              }}
              className="w-full rounded-xl border border-[#ddd3c9] bg-white px-4 py-3 text-[0.98rem] text-[#4f4a46] shadow-sm outline-none focus:border-[#b7c3ae] focus:ring-2 focus:ring-[#dfe8d8]"
            >
              <option value="EDD">Estimated Due Date (EDD)</option>
              <option value="WEEK">
                Current Pregnancy Week along with Date of Enrollment
              </option>
              <option value="LMP">Last Menstrual Period Date</option>
            </select>
          </div>

          <div className="mt-4">
            {method === "WEEK" ? (
              <input
                type="number"
                placeholder="Enter current pregnancy week"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="w-full rounded-xl border border-[#ddd3c9] bg-white px-4 py-3 text-[0.98rem] text-[#4f4a46] shadow-sm outline-none focus:border-[#b7c3ae] focus:ring-2 focus:ring-[#dfe8d8]"
              />
            ) : (
              <input
                type="date"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="w-full rounded-xl border border-[#ddd3c9] bg-white px-4 py-3 text-[0.98rem] text-[#4f4a46] shadow-sm outline-none focus:border-[#b7c3ae] focus:ring-2 focus:ring-[#dfe8d8]"
              />
            )}
          </div>

          {error && (
            <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </p>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="mt-5 w-full rounded-xl bg-[#6b8e6a] px-4 py-3 text-base font-medium text-white shadow-sm transition hover:bg-[#5f815f] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Saving..." : "Submit"}
          </button>

          <p className="mt-4 text-center text-xs text-[#9c948d]">
            TEMP onboarding design — replace or refine later
          </p>
        </div>
      </div>
    </main>
  );
}
