/*
  Warnings:

  - A unique constraint covering the columns `[area_id,stage]` on the table `Area` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Stage" ALTER COLUMN "stageNumber" DROP NOT NULL,
ALTER COLUMN "stageNumber" DROP DEFAULT;

-- CreateIndex
CREATE UNIQUE INDEX "Area_area_id_stage_key" ON "Area"("area_id", "stage");
