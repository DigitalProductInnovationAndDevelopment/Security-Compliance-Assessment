/*
  Warnings:

  - A unique constraint covering the columns `[standard_id,practice]` on the table `Standard` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Standard_standard_id_practice_key" ON "Standard"("standard_id", "practice");
