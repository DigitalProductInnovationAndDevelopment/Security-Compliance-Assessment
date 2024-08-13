/*
  Warnings:

  - You are about to drop the column `question` on the `Area` table. All the data in the column will be lost.
  - You are about to drop the `Post` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_createdById_fkey";

-- DropIndex
DROP INDEX "Area_area_id_area_name_stageId_key";

-- AlterTable
ALTER TABLE "Area" DROP COLUMN "question";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" TEXT NOT NULL DEFAULT 'assessee';

-- DropTable
DROP TABLE "Post";

-- CreateTable
CREATE TABLE "Project" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "archived" BOOLEAN NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Assessment" (
    "userId" TEXT NOT NULL,
    "projectId" INTEGER NOT NULL,
    "areasMaturityScore" DOUBLE PRECISION NOT NULL,
    "artefactCompletenessScore" DOUBLE PRECISION NOT NULL,
    "areaCompletenessScore" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Assessment_pkey" PRIMARY KEY ("userId","projectId")
);

-- CreateTable
CREATE TABLE "StageScore" (
    "id" SERIAL NOT NULL,
    "stageId" INTEGER NOT NULL,
    "assessmentUserId" TEXT NOT NULL,
    "assessmentProjectId" INTEGER NOT NULL,
    "artefactsCompletenessScore" DOUBLE PRECISION NOT NULL,
    "areaMaturityScore" DOUBLE PRECISION NOT NULL,
    "areaCompletenessScore" DOUBLE PRECISION NOT NULL,
    "targetAreaMaturityScore" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "StageScore_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Question" (
    "id" SERIAL NOT NULL,
    "body" TEXT NOT NULL,

    CONSTRAINT "Question_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AnswerAreaQuestion" (
    "id" SERIAL NOT NULL,
    "questionId" INTEGER NOT NULL,
    "assessmentUserId" TEXT NOT NULL,
    "assessmentProjectId" INTEGER NOT NULL,
    "assessedScore" INTEGER NOT NULL,
    "targetScore" INTEGER NOT NULL,
    "answered" BOOLEAN NOT NULL,
    "comment" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AnswerAreaQuestion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AnswerArtefact" (
    "id" SERIAL NOT NULL,
    "assessmentUserId" TEXT NOT NULL,
    "assessmentProjectId" INTEGER NOT NULL,
    "artefactId" INTEGER NOT NULL,
    "comment" TEXT NOT NULL,
    "answered" BOOLEAN NOT NULL,
    "answer" BOOLEAN NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AnswerArtefact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AreaScore" (
    "id" SERIAL NOT NULL,
    "areaId" INTEGER NOT NULL,
    "assessmentUserId" TEXT NOT NULL,
    "assessmentProjectId" INTEGER NOT NULL,
    "artefactsCompletenessScore" DOUBLE PRECISION NOT NULL,
    "areaMaturityScore" DOUBLE PRECISION NOT NULL,
    "areaCompletenessScore" DOUBLE PRECISION NOT NULL,
    "targeAreaMaturityScore" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "AreaScore_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_AreaToQuestion" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_UserProjects" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "StageScore_assessmentUserId_assessmentProjectId_stageId_key" ON "StageScore"("assessmentUserId", "assessmentProjectId", "stageId");

-- CreateIndex
CREATE UNIQUE INDEX "AnswerAreaQuestion_assessmentUserId_assessmentProjectId_que_key" ON "AnswerAreaQuestion"("assessmentUserId", "assessmentProjectId", "questionId");

-- CreateIndex
CREATE UNIQUE INDEX "AnswerArtefact_assessmentUserId_assessmentProjectId_artefac_key" ON "AnswerArtefact"("assessmentUserId", "assessmentProjectId", "artefactId");

-- CreateIndex
CREATE UNIQUE INDEX "AreaScore_assessmentUserId_assessmentProjectId_areaId_key" ON "AreaScore"("assessmentUserId", "assessmentProjectId", "areaId");

-- CreateIndex
CREATE UNIQUE INDEX "_AreaToQuestion_AB_unique" ON "_AreaToQuestion"("A", "B");

-- CreateIndex
CREATE INDEX "_AreaToQuestion_B_index" ON "_AreaToQuestion"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_UserProjects_AB_unique" ON "_UserProjects"("A", "B");

-- CreateIndex
CREATE INDEX "_UserProjects_B_index" ON "_UserProjects"("B");

-- AddForeignKey
ALTER TABLE "Assessment" ADD CONSTRAINT "Assessment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Assessment" ADD CONSTRAINT "Assessment_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StageScore" ADD CONSTRAINT "StageScore_stageId_fkey" FOREIGN KEY ("stageId") REFERENCES "Stage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StageScore" ADD CONSTRAINT "StageScore_assessmentUserId_assessmentProjectId_fkey" FOREIGN KEY ("assessmentUserId", "assessmentProjectId") REFERENCES "Assessment"("userId", "projectId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnswerAreaQuestion" ADD CONSTRAINT "AnswerAreaQuestion_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnswerAreaQuestion" ADD CONSTRAINT "AnswerAreaQuestion_assessmentUserId_assessmentProjectId_fkey" FOREIGN KEY ("assessmentUserId", "assessmentProjectId") REFERENCES "Assessment"("userId", "projectId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnswerArtefact" ADD CONSTRAINT "AnswerArtefact_assessmentUserId_assessmentProjectId_fkey" FOREIGN KEY ("assessmentUserId", "assessmentProjectId") REFERENCES "Assessment"("userId", "projectId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnswerArtefact" ADD CONSTRAINT "AnswerArtefact_artefactId_fkey" FOREIGN KEY ("artefactId") REFERENCES "Artefact"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AreaScore" ADD CONSTRAINT "AreaScore_areaId_fkey" FOREIGN KEY ("areaId") REFERENCES "Area"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AreaScore" ADD CONSTRAINT "AreaScore_assessmentUserId_assessmentProjectId_fkey" FOREIGN KEY ("assessmentUserId", "assessmentProjectId") REFERENCES "Assessment"("userId", "projectId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AreaToQuestion" ADD CONSTRAINT "_AreaToQuestion_A_fkey" FOREIGN KEY ("A") REFERENCES "Area"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AreaToQuestion" ADD CONSTRAINT "_AreaToQuestion_B_fkey" FOREIGN KEY ("B") REFERENCES "Question"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserProjects" ADD CONSTRAINT "_UserProjects_A_fkey" FOREIGN KEY ("A") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserProjects" ADD CONSTRAINT "_UserProjects_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
