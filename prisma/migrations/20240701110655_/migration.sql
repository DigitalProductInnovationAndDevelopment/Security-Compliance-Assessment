/*
  Warnings:

  - The primary key for the `Area` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `stage` on the `Area` table. All the data in the column will be lost.
  - The primary key for the `Artefact` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `artefact_area_id` on the `Artefact` table. All the data in the column will be lost.
  - The primary key for the `Stage` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `stage` on the `Stage` table. All the data in the column will be lost.
  - The primary key for the `Standard` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `artefactArtefact_id` on the `Standard` table. All the data in the column will be lost.
  - You are about to drop the column `artefactsList` on the `Standard` table. All the data in the column will be lost.
  - The `id` column on the `Standard` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `Project` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ProjectArtefactScore` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[area_id]` on the table `Area` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[artefact_id]` on the table `Artefact` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `stageId` to the `Area` table without a default value. This is not possible if the table is not empty.
  - Added the required column `areaId` to the `Artefact` table without a default value. This is not possible if the table is not empty.
  - Made the column `in_project` on table `Artefact` required. This step will fail if there are existing NULL values in that column.
  - Made the column `origin_standard` on table `Artefact` required. This step will fail if there are existing NULL values in that column.
  - Made the column `origin_practice` on table `Artefact` required. This step will fail if there are existing NULL values in that column.
  - Made the column `origin_literature_review` on table `Artefact` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `name` to the `Stage` table without a default value. This is not possible if the table is not empty.
  - Made the column `stageNumber` on table `Stage` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `artefactId` to the `Standard` table without a default value. This is not possible if the table is not empty.
  - Made the column `standard_id` on table `Standard` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Area" DROP CONSTRAINT "Area_stage_fkey";

-- DropForeignKey
ALTER TABLE "Artefact" DROP CONSTRAINT "Artefact_artefact_area_id_fkey";

-- DropForeignKey
ALTER TABLE "ProjectArtefactScore" DROP CONSTRAINT "ProjectArtefactScore_artefactId_fkey";

-- DropForeignKey
ALTER TABLE "ProjectArtefactScore" DROP CONSTRAINT "ProjectArtefactScore_projectId_fkey";

-- DropForeignKey
ALTER TABLE "Standard" DROP CONSTRAINT "Standard_artefactArtefact_id_fkey";

-- DropIndex
DROP INDEX "Area_area_id_stage_key";

-- AlterTable
ALTER TABLE "Area" DROP CONSTRAINT "Area_pkey",
DROP COLUMN "stage",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD COLUMN     "stageId" INTEGER NOT NULL,
ALTER COLUMN "question" DROP NOT NULL,
ALTER COLUMN "assessors_guide" DROP NOT NULL,
ADD CONSTRAINT "Area_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Artefact" DROP CONSTRAINT "Artefact_pkey",
DROP COLUMN "artefact_area_id",
ADD COLUMN     "areaId" INTEGER NOT NULL,
ADD COLUMN     "id" SERIAL NOT NULL,
ALTER COLUMN "in_project" SET NOT NULL,
ALTER COLUMN "origin_standard" SET NOT NULL,
ALTER COLUMN "origin_practice" SET NOT NULL,
ALTER COLUMN "origin_literature_review" SET NOT NULL,
ADD CONSTRAINT "Artefact_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Stage" DROP CONSTRAINT "Stage_pkey",
DROP COLUMN "stage",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL,
ALTER COLUMN "stageNumber" SET NOT NULL,
ADD CONSTRAINT "Stage_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Standard" DROP CONSTRAINT "Standard_pkey",
DROP COLUMN "artefactArtefact_id",
DROP COLUMN "artefactsList",
ADD COLUMN     "artefactId" INTEGER NOT NULL,
ADD COLUMN     "artefacts" TEXT[],
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ALTER COLUMN "standard_id" SET NOT NULL,
ADD CONSTRAINT "Standard_pkey" PRIMARY KEY ("id");

-- DropTable
DROP TABLE "Project";

-- DropTable
DROP TABLE "ProjectArtefactScore";

-- CreateIndex
CREATE UNIQUE INDEX "Area_area_id_key" ON "Area"("area_id");

-- CreateIndex
CREATE UNIQUE INDEX "Artefact_artefact_id_key" ON "Artefact"("artefact_id");

-- AddForeignKey
ALTER TABLE "Standard" ADD CONSTRAINT "Standard_artefactId_fkey" FOREIGN KEY ("artefactId") REFERENCES "Artefact"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Artefact" ADD CONSTRAINT "Artefact_areaId_fkey" FOREIGN KEY ("areaId") REFERENCES "Area"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Area" ADD CONSTRAINT "Area_stageId_fkey" FOREIGN KEY ("stageId") REFERENCES "Stage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
