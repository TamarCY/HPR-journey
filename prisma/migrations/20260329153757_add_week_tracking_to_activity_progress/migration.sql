-- AlterTable
ALTER TABLE "ActivityProgress" ADD COLUMN     "assignedStudyWeek" INTEGER,
ADD COLUMN     "completedStudyWeek" INTEGER;

-- CreateIndex
CREATE INDEX "ActivityProgress_assignedStudyWeek_idx" ON "ActivityProgress"("assignedStudyWeek");

-- CreateIndex
CREATE INDEX "ActivityProgress_completedStudyWeek_idx" ON "ActivityProgress"("completedStudyWeek");
