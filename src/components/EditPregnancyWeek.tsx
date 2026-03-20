"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  currentWeek: number;
};

export default function EditPregnancyWeek({ currentWeek }: Props) {
  const router = useRouter();

  const [isEditing, setIsEditing] = useState(false);
  const [week, setWeek] = useState(String(currentWeek));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSave = async () => {
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/update-pregnancy-week", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ week }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to update week");
        setLoading(false);
        return;
      }

      setIsEditing(false);
      router.refresh();
    } catch {
      setError("Failed to update week");
    } finally {
      setLoading(false);
    }
  };

  if (!isEditing) {
    return (
      <button
        type="button"
        onClick={() => setIsEditing(true)}
        className="inline-flex items-center gap-2 rounded-full bg-[#eef3ea] px-3 py-1 text-sm font-medium text-[#586b56] shadow-sm ring-1 ring-[#dfe8d8]"
      >
        <span>{currentWeek}</span>
        <span className="text-xs">✎</span>
      </button>
    );
  }

  return (
    <span className="inline-flex flex-col items-center gap-2">
      <span className="inline-flex items-center gap-2">
        <input
          type="number"
          min={1}
          max={42}
          value={week}
          onChange={(e) => setWeek(e.target.value)}
          className="w-16 rounded-lg border border-[#ddd3c9] bg-white px-2 py-1 text-center text-sm"
        />
        <button
          type="button"
          onClick={handleSave}
          disabled={loading}
          className="rounded-lg bg-[#6b8e6a] px-2 py-1 text-xs text-white disabled:opacity-60"
        >
          {loading ? "..." : "Save"}
        </button>
        <button
          type="button"
          onClick={() => {
            setWeek(String(currentWeek));
            setError("");
            setIsEditing(false);
          }}
          className="rounded-lg bg-[#ece4dc] px-2 py-1 text-xs text-[#4f4a46]"
        >
          Cancel
        </button>
      </span>

      {error && <span className="text-xs text-red-600">{error}</span>}
    </span>
  );
}
