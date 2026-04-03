"use client";

export default function ShareDoctorFormButton() {
  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: "Patient Care Request",
        text: "Patient care request for trauma-informed support",
        url: `${window.location.origin}/app/doctor-form/print`,
      });
    } else {
      await navigator.clipboard.writeText(
        `${window.location.origin}/app/doctor-form/print`,
      );
      alert("Link copied");
    }
  };

  return (
    <button
      type="button"
      onClick={handleShare}
      className="w-full rounded-xl bg-white px-4 py-3 text-[#4f4a46] shadow-sm ring-1 ring-[#ece4dc]"
    >
      Share
    </button>
  );
}
