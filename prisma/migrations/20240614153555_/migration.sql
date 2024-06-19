/*
  Warnings:

  - The primary key for the `Area` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "Artefact" DROP CONSTRAINT "Artefact_artefact_area_id_stage_fkey";

-- DropIndex
DROP INDEX "Stage_stage_key";

-- AlterTable
ALTER TABLE "Area" DROP CONSTRAINT "Area_pkey",
ADD CONSTRAINT "Area_pkey" PRIMARY KEY ("area_id");

-- AddForeignKey
ALTER TABLE "Artefact" ADD CONSTRAINT "Artefact_artefact_area_id_fkey" FOREIGN KEY ("artefact_area_id") REFERENCES "Area"("area_id") ON DELETE RESTRICT ON UPDATE CASCADE;
