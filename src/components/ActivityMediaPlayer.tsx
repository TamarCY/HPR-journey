"use client";

import { useRef, useState } from "react";

type Props = {
  activityId: string;
  videoUrl?: string | null;
  audioUrl?: string | null;
};

async function logActivityEvent(eventType: string, activityId: string) {
  await fetch("/api/log-event", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ eventType, activityId }),
  });
}

export default function ActivityMediaPlayer({ activityId, videoUrl, audioUrl }: Props) {
  const [hasCompletedByPlayback, setHasCompletedByPlayback] = useState(false);
  const startedLoggedRef = useRef(false);
  const playback80LoggedRef = useRef(false);

  const markStarted = async () => {
    if (startedLoggedRef.current) return;
    startedLoggedRef.current = true;

    await logActivityEvent("PLAYBACK_STARTED", activityId);
  };

  const markCompletedByPlayback = async () => {
    if (hasCompletedByPlayback) return;

    setHasCompletedByPlayback(true);

    if (!playback80LoggedRef.current) {
      playback80LoggedRef.current = true;
      await logActivityEvent("PLAYBACK_80", activityId);
    }

    await fetch("/api/complete-activity", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        activityId,
        completionSource: "AUTO_PLAYBACK_END",
      }),
    });
  };

  const handleTimeUpdate = async (element: HTMLVideoElement | HTMLAudioElement) => {
    if (!element.duration || Number.isNaN(element.duration)) return;

    const progress = element.currentTime / element.duration;

    if (progress >= 0.8) {
      await markCompletedByPlayback();
    }
  };

  if (videoUrl) {
    return (
      <div className="mt-5">
        <video
          key={videoUrl}
          src={videoUrl}
          controls
          playsInline
          muted
          preload="metadata"
          className="w-full rounded-[24px] bg-black"
          onPlay={markStarted}
          onTimeUpdate={(e) => handleTimeUpdate(e.currentTarget)}
        >
          Your browser does not support the video tag.
        </video>
      </div>
    );
  }

  if (audioUrl) {
    return (
      <div className="mt-5 rounded-[24px] bg-[#f6efe7] p-4">
        <audio
          key={audioUrl}
          src={audioUrl}
          controls
          preload="metadata"
          className="w-full"
          onPlay={markStarted}
          onTimeUpdate={(e) => handleTimeUpdate(e.currentTarget)}
        >
          Your browser does not support the audio element.
        </audio>
      </div>
    );
  }

  return null;
}
