/*
  Warnings:

  - You are about to drop the column `artefactArtefact_id` on the `Standard` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Standard" DROP CONSTRAINT "Standard_artefactArtefact_id_fkey";

-- DropIndex
DROP INDEX "Area_area_id_stage_key";

-- DropIndex
DROP INDEX "Artefact_artefact_area_id_stage_key";

-- AlterTable
ALTER TABLE "Standard" DROP COLUMN "artefactArtefact_id",
ADD COLUMN     "artefactId" TEXT;

-- AddForeignKey
ALTER TABLE "Standard" ADD CONSTRAINT "Standard_artefactId_fkey" FOREIGN KEY ("artefactId") REFERENCES "Artefact"("artefact_id") ON DELETE SET NULL ON UPDATE CASCADE;
