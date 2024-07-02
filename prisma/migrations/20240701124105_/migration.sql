/*
  Warnings:

  - A unique constraint covering the columns `[area_id,area_name,stageId]` on the table `Area` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Area_area_id_key";

-- CreateIndex
CREATE UNIQUE INDEX "Area_area_id_area_name_stageId_key" ON "Area"("area_id", "area_name", "stageId");
