"use client";

import Link from "next/link";

type Props = {
  taskId: string;
  children: React.ReactNode;
  className?: string;
};

export default function PastTaskLink({ taskId, children, className }: Props) {
  const handleClick = () => {
    fetch("/api/log-event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ eventType: "PAST_TASK_OPENED", activityId: taskId }),
    });
  };

  return (
    <Link href={`/app/activity/${taskId}`} onClick={handleClick} className={className}>
      {children}
    </Link>
  );
}
