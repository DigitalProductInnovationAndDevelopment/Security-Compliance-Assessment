/*
  Warnings:

  - A unique constraint covering the columns `[artefact_id,artefact_name,stage]` on the table `Artefact` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Artefact_artefact_id_key";

-- CreateIndex
CREATE UNIQUE INDEX "Artefact_artefact_id_artefact_name_stage_key" ON "Artefact"("artefact_id", "artefact_name", "stage");
