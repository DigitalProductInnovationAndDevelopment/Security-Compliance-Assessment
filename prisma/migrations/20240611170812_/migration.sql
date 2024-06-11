-- AlterTable
ALTER TABLE "Artefact" ALTER COLUMN "origin_standard" DROP NOT NULL,
ALTER COLUMN "origin_practice" DROP NOT NULL,
ALTER COLUMN "origin_literature_review" DROP NOT NULL;
