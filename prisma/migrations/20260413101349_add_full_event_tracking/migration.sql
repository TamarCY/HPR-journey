-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "EventType" ADD VALUE 'PLAYBACK_STARTED';
ALTER TYPE "EventType" ADD VALUE 'PLAYBACK_80';
ALTER TYPE "EventType" ADD VALUE 'TEST_PREP_VIEWED';
ALTER TYPE "EventType" ADD VALUE 'PAST_TASKS_VIEWED';
ALTER TYPE "EventType" ADD VALUE 'PAST_TASK_OPENED';
ALTER TYPE "EventType" ADD VALUE 'PREGNANCY_WEEK_EDITED';
ALTER TYPE "EventType" ADD VALUE 'DOCTOR_FORM_VIEWED';
ALTER TYPE "EventType" ADD VALUE 'DOCTOR_FORM_PREVIEWED';
ALTER TYPE "EventType" ADD VALUE 'DOCTOR_FORM_EDITED';
ALTER TYPE "EventType" ADD VALUE 'DOCTOR_FORM_PRINTED';
ALTER TYPE "EventType" ADD VALUE 'DOCTOR_FORM_PDF_SAVED';
ALTER TYPE "EventType" ADD VALUE 'DOCTOR_FORM_PDF_SHARED';
