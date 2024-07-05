/*
  Warnings:

  - A unique constraint covering the columns `[standard_id,practice,artefactId]` on the table `Standard` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Standard_standard_id_practice_key";

-- CreateIndex
CREATE UNIQUE INDEX "Standard_standard_id_practice_artefactId_key" ON "Standard"("standard_id", "practice", "artefactId");
