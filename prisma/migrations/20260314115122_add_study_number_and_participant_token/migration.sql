/*
  Warnings:

  - A unique constraint covering the columns `[studyNumber]` on the table `Participant` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `studyNumber` to the `Participant` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Participant" ADD COLUMN     "studyNumber" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "ParticipantToken" (
    "id" TEXT NOT NULL,
    "participantId" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ParticipantToken_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ParticipantToken_tokenHash_key" ON "ParticipantToken"("tokenHash");

-- CreateIndex
CREATE UNIQUE INDEX "Participant_studyNumber_key" ON "Participant"("studyNumber");

-- AddForeignKey
ALTER TABLE "ParticipantToken" ADD CONSTRAINT "ParticipantToken_participantId_fkey" FOREIGN KEY ("participantId") REFERENCES "Participant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
