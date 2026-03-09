-- CreateTable
CREATE TABLE "Participant" (
    "id" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'NOT_STARTED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastSeenAt" TIMESTAMP(3),
    "onboardingCompletedAt" TIMESTAMP(3),
    "eddDate" DATE,

    CONSTRAINT "Participant_pkey" PRIMARY KEY ("id")
);
