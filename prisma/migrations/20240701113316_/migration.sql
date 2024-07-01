/*
  Warnings:

  - Added the required column `artefact_area_id` to the `Artefact` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Artefact" ADD COLUMN     "artefact_area_id" TEXT NOT NULL;
