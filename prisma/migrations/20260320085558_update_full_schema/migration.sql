/*
  Warnings:

  - The `status` column on the `Participant` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "ParticipantStatus" AS ENUM ('NOT_STARTED', 'ONBOARDING_REQUIRED', 'ACTIVE', 'COMPLETED');

-- CreateEnum
CREATE TYPE "DatingMethod" AS ENUM ('LMP', 'EDD', 'WEEK_AT_ONBOARDING', 'MANUAL_EDIT');

-- CreateEnum
CREATE TYPE "ActivityType" AS ENUM ('BREATHING', 'WEEKLY', 'TEST_PREP');

-- CreateEnum
CREATE TYPE "BreathingSlot" AS ENUM ('MORNING', 'NIGHT');

-- CreateEnum
CREATE TYPE "CompletionSource" AS ENUM ('FINISHED_BUTTON', 'AUTO_PLAYBACK_END');

-- CreateEnum
CREATE TYPE "EventType" AS ENUM ('PAGE_OPEN', 'ONBOARDING_STARTED', 'ONBOARDING_COMPLETED', 'ACTIVITY_STARTED', 'ACTIVITY_COMPLETED');

-- DropForeignKey
ALTER TABLE "ParticipantToken" DROP CONSTRAINT "ParticipantToken_participantId_fkey";

-- DropForeignKey
ALTER TABLE "Session" DROP CONSTRAINT "Session_participantId_fkey";

-- AlterTable
ALTER TABLE "Participant" ADD COLUMN     "datingMethod" "DatingMethod",
ADD COLUMN     "gestationalAnchorDate" DATE,
ADD COLUMN     "lastManualWeekEditAt" TIMESTAMP(3),
ADD COLUMN     "lmpDate" DATE,
ADD COLUMN     "onboardingDate" DATE,
ADD COLUMN     "timezone" TEXT NOT NULL DEFAULT 'America/New_York',
ADD COLUMN     "weekAtOnboarding" INTEGER,
DROP COLUMN "status",
ADD COLUMN     "status" "ParticipantStatus" NOT NULL DEFAULT 'NOT_STARTED';

-- AlterTable
ALTER TABLE "ParticipantToken" ADD COLUMN     "revokedAt" TIMESTAMP(3),
ADD COLUMN     "usedAt" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "Activity" (
    "id" TEXT NOT NULL,
    "type" "ActivityType" NOT NULL,
    "title" TEXT NOT NULL,
    "subtitle" TEXT,
    "contentText" TEXT,
    "audioUrl" TEXT,
    "videoUrl" TEXT,
    "imageUrl" TEXT,
    "breathingSlot" "BreathingSlot",
    "minPregnancyWeek" INTEGER,
    "maxPregnancyWeek" INTEGER,
    "orderIndex" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Activity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ActivityProgress" (
    "id" TEXT NOT NULL,
    "participantId" TEXT NOT NULL,
    "activityId" TEXT NOT NULL,
    "progressDate" DATE,
    "pregnancyWeek" INTEGER,
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "completionSource" "CompletionSource",
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ActivityProgress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventLog" (
    "id" TEXT NOT NULL,
    "participantId" TEXT NOT NULL,
    "activityId" TEXT,
    "eventType" "EventType" NOT NULL,
    "pregnancyWeek" INTEGER,
    "occurredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "metadata" JSONB,

    CONSTRAINT "EventLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Activity_type_idx" ON "Activity"("type");

-- CreateIndex
CREATE INDEX "Activity_breathingSlot_idx" ON "Activity"("breathingSlot");

-- CreateIndex
CREATE INDEX "Activity_minPregnancyWeek_maxPregnancyWeek_idx" ON "Activity"("minPregnancyWeek", "maxPregnancyWeek");

-- CreateIndex
CREATE INDEX "Activity_orderIndex_idx" ON "Activity"("orderIndex");

-- CreateIndex
CREATE INDEX "ActivityProgress_participantId_idx" ON "ActivityProgress"("participantId");

-- CreateIndex
CREATE INDEX "ActivityProgress_activityId_idx" ON "ActivityProgress"("activityId");

-- CreateIndex
CREATE INDEX "ActivityProgress_progressDate_idx" ON "ActivityProgress"("progressDate");

-- CreateIndex
CREATE INDEX "ActivityProgress_pregnancyWeek_idx" ON "ActivityProgress"("pregnancyWeek");

-- CreateIndex
CREATE UNIQUE INDEX "ActivityProgress_participantId_activityId_progressDate_key" ON "ActivityProgress"("participantId", "activityId", "progressDate");

-- CreateIndex
CREATE INDEX "EventLog_participantId_idx" ON "EventLog"("participantId");

-- CreateIndex
CREATE INDEX "EventLog_activityId_idx" ON "EventLog"("activityId");

-- CreateIndex
CREATE INDEX "EventLog_eventType_idx" ON "EventLog"("eventType");

-- CreateIndex
CREATE INDEX "EventLog_occurredAt_idx" ON "EventLog"("occurredAt");

-- CreateIndex
CREATE INDEX "ParticipantToken_participantId_idx" ON "ParticipantToken"("participantId");

-- CreateIndex
CREATE INDEX "Session_participantId_idx" ON "Session"("participantId");

-- CreateIndex
CREATE INDEX "Session_expiresAt_idx" ON "Session"("expiresAt");

-- AddForeignKey
ALTER TABLE "ParticipantToken" ADD CONSTRAINT "ParticipantToken_participantId_fkey" FOREIGN KEY ("participantId") REFERENCES "Participant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_participantId_fkey" FOREIGN KEY ("participantId") REFERENCES "Participant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivityProgress" ADD CONSTRAINT "ActivityProgress_participantId_fkey" FOREIGN KEY ("participantId") REFERENCES "Participant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivityProgress" ADD CONSTRAINT "ActivityProgress_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "Activity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventLog" ADD CONSTRAINT "EventLog_participantId_fkey" FOREIGN KEY ("participantId") REFERENCES "Participant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventLog" ADD CONSTRAINT "EventLog_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "Activity"("id") ON DELETE SET NULL ON UPDATE CASCADE;
