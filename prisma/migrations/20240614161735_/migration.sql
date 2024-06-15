/*
  Warnings:

  - You are about to drop the column `artefactId` on the `Standard` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Standard" DROP CONSTRAINT "Standard_artefactId_fkey";

-- AlterTable
ALTER TABLE "Standard" DROP COLUMN "artefactId",
ADD COLUMN     "artefactArtefact_id" TEXT;

-- AddForeignKey
ALTER TABLE "Standard" ADD CONSTRAINT "Standard_artefactArtefact_id_fkey" FOREIGN KEY ("artefactArtefact_id") REFERENCES "Artefact"("artefact_id") ON DELETE SET NULL ON UPDATE CASCADE;
