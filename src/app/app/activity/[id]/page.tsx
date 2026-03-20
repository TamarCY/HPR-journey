import Link from "next/link";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/db";
import { getSession } from "@/lib/getSession";

export default async function ActivityPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getSession();

  if (!session) {
    redirect("/unauthorized");
  }

  const { id } = await params;

  const activity = await prisma.activity.findUnique({
    where: { id },
  });

  if (!activity) {
    redirect("/app");
  }

  return (
    <main className="min-h-screen bg-[#f7f3ef] px-5 py-6 text-[#4f4a46]">
      <div className="mx-auto max-w-sm space-y-5">
        <Link href="/app" className="inline-block text-sm text-[#6d6661]">
          ← Back
        </Link>

        <div className="rounded-[28px] bg-[#fbf8f5] px-6 py-8 shadow-sm ring-1 ring-[#ece4dc]">
          <h1 className="font-serif text-[2rem] font-semibold leading-tight text-[#586b56]">
            {activity.title}
          </h1>

          {activity.subtitle && (
            <p className="mt-3 text-[0.98rem] leading-7 text-[#6d6661]">
              {activity.subtitle}
            </p>
          )}

          {activity.imageUrl && (
            <div className="mt-5 overflow-hidden rounded-[24px] bg-[#f6efe7]">
              <img
                src={activity.imageUrl}
                alt={activity.title}
                className="h-auto w-full object-cover"
              />
            </div>
          )}

          {activity.videoUrl && (
            <div className="mt-5">
              <video
                controls
                playsInline
                preload="metadata"
                className="w-full rounded-[24px] bg-black"
              >
                <source src={activity.videoUrl} />
                Your browser does not support the video tag.
              </video>
            </div>
          )}

          {activity.audioUrl && (
            <div className="mt-5 rounded-[24px] bg-[#f6efe7] p-4">
              <audio controls preload="metadata" className="w-full">
                <source src={activity.audioUrl} />
                Your browser does not support the audio element.
              </audio>
            </div>
          )}

          {activity.contentText && (
            <div className="mt-5 rounded-[24px] bg-[#f6efe7] p-5">
              <p className="text-[0.98rem] leading-7 text-[#6d6661]">
                {activity.contentText}
              </p>
            </div>
          )}

          {!activity.videoUrl && !activity.audioUrl && !activity.contentText && (
            <div className="mt-5 rounded-[24px] bg-[#f6efe7] p-5 text-sm text-[#8b857f]">
              No activity content available yet.
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
