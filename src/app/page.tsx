// ⚠️ TEMP DEV PAGE
// This page is only for development.
// It allows creating test participants and accessing the app quickly.
// ❗ DELETE this page before production release.

"use client";

export default function HomePage() {
  const handleCreateParticipant = async () => {
    try {
      const res = await fetch("/api/create-participant", {
        method: "POST",
      });

      const data = await res.json();

      if (data.personalUrl) {
        window.location.href = data.personalUrl;
      } else {
        alert("Failed to create participant");
      }
    } catch (err) {
      console.error(err);
      alert("Error creating participant");
    }
  };

  const handleOpenTestUser = () => {
    const tokens = {
      local: "998668e46d5078e34fceb3cd97a160d406d9306d11bd3ca252da92b4cb4649b1",
      dev: "DEV_TOKEN",
    };

    const isLocal = window.location.origin.includes("localhost");

    const token = isLocal ? tokens.local : tokens.dev;

    window.location.href = `${window.location.origin}/t/${token}`;
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f7f3ef] px-6">
      <div className="w-full max-w-sm space-y-6 text-center">
        <h1 className="font-serif text-3xl text-[#4f4a46]">HPR Journey (Dev Panel)</h1>

        <p className="text-sm text-[#6b6a66]">Temporary development tools</p>

        {/* Create new participant */}
        <button
          onClick={handleCreateParticipant}
          className="w-full rounded-xl bg-[#6b7e68] px-4 py-4 text-white shadow-md transition hover:opacity-90"
        >
          Create New Participant
        </button>

        {/* Open test user */}
        <button
          onClick={handleOpenTestUser}
          className="w-full rounded-xl border border-[#d9d2ca] bg-white px-4 py-4 text-[#4f4a46] shadow-sm"
        >
          Open Test User
        </button>

        <p className="text-xs text-[#a09b95]">
          ⚠️ This screen is temporary and should be removed before release
        </p>
      </div>
    </main>
  );
}
