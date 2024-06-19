/*
  Warnings:

  - The primary key for the `Area` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[artefact_area_id,stage]` on the table `Artefact` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[stage]` on the table `Stage` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Artefact" DROP CONSTRAINT "Artefact_artefact_area_id_fkey";

-- AlterTable
ALTER TABLE "Area" DROP CONSTRAINT "Area_pkey",
ADD CONSTRAINT "Area_pkey" PRIMARY KEY ("area_id", "stage");

-- CreateIndex
CREATE UNIQUE INDEX "Artefact_artefact_area_id_stage_key" ON "Artefact"("artefact_area_id", "stage");

-- CreateIndex
CREATE UNIQUE INDEX "Stage_stage_key" ON "Stage"("stage");

-- AddForeignKey
ALTER TABLE "Artefact" ADD CONSTRAINT "Artefact_artefact_area_id_stage_fkey" FOREIGN KEY ("artefact_area_id", "stage") REFERENCES "Area"("area_id", "stage") ON DELETE RESTRICT ON UPDATE CASCADE;
