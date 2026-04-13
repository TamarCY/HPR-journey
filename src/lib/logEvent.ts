import { EventType } from "@prisma/client";
import { prisma } from "@/lib/db";

type LogEventArgs = {
  participantId: string;
  eventType: EventType;
  pregnancyWeek?: number | null;
  activityId?: string | null;
  metadata?: Record<string, unknown>;
};

export async function logEvent({
  participantId,
  eventType,
  pregnancyWeek,
  activityId,
  metadata,
}: LogEventArgs) {
  try {
    await prisma.eventLog.create({
      data: {
        participantId,
        eventType,
        pregnancyWeek: pregnancyWeek ?? null,
        activityId: activityId ?? null,
        metadata: metadata as any,
      },
    });
  } catch (e) {
    console.error("[logEvent] Failed to log event:", eventType, e);
  }
}
