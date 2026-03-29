"use client";

import { useRef, useState } from "react";

type Props = {
  activityId: string;
  videoUrl?: string | null;
  audioUrl?: string | null;
};

export default function ActivityMediaPlayer({ activityId, videoUrl, audioUrl }: Props) {
  const [hasStarted, setHasStarted] = useState(false);
  const [hasCompletedByPlayback, setHasCompletedByPlayback] = useState(false);
  const startedLoggedRef = useRef(false);

  const markStarted = async () => {
    if (startedLoggedRef.current) return;
    startedLoggedRef.current = true;
    setHasStarted(true);

    // later we can add /api/log-event here
  };

  const markCompletedByPlayback = async () => {
    if (hasCompletedByPlayback) return;

    setHasCompletedByPlayback(true);

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
