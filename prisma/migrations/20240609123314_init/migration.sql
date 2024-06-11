-- CreateTable
CREATE TABLE "Post" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdById" TEXT NOT NULL,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,
    "refresh_token_expires_in" INTEGER,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "Standard" (
    "id" TEXT NOT NULL,
    "practice" TEXT NOT NULL,
    "requirements" TEXT[],
    "artefactsList" TEXT[],
    "artefactArtefact_id" TEXT,

    CONSTRAINT "Standard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Artefact" (
    "artefact_id" TEXT NOT NULL,
    "artefact_name" TEXT NOT NULL,
    "artefact_area_id" TEXT NOT NULL,
    "stage" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "in_project" BOOLEAN NOT NULL,
    "origin_standard" BOOLEAN NOT NULL,
    "origin_practice" BOOLEAN NOT NULL,
    "origin_literature_review" BOOLEAN NOT NULL,
    "automation" TEXT NOT NULL,

    CONSTRAINT "Artefact_pkey" PRIMARY KEY ("artefact_id")
);

-- CreateTable
CREATE TABLE "Area" (
    "area_id" TEXT NOT NULL,
    "area_name" TEXT NOT NULL,
    "stage" TEXT NOT NULL,
    "people" TEXT NOT NULL,
    "process" TEXT NOT NULL,
    "technology" TEXT NOT NULL,
    "people_practices" TEXT[],
    "process_practices" TEXT[],
    "technology_practices" TEXT[],
    "roles" TEXT[],
    "question" TEXT NOT NULL,
    "assessors_guide" TEXT NOT NULL,

    CONSTRAINT "Area_pkey" PRIMARY KEY ("area_id")
);

-- CreateTable
CREATE TABLE "Stage" (
    "stage" TEXT NOT NULL,

    CONSTRAINT "Stage_pkey" PRIMARY KEY ("stage")
);

-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectArtefactScore" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "artefactId" TEXT NOT NULL,
    "score" INTEGER NOT NULL,

    CONSTRAINT "ProjectArtefactScore_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Post_name_idx" ON "Post"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Standard" ADD CONSTRAINT "Standard_artefactArtefact_id_fkey" FOREIGN KEY ("artefactArtefact_id") REFERENCES "Artefact"("artefact_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Artefact" ADD CONSTRAINT "Artefact_artefact_area_id_fkey" FOREIGN KEY ("artefact_area_id") REFERENCES "Area"("area_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Area" ADD CONSTRAINT "Area_stage_fkey" FOREIGN KEY ("stage") REFERENCES "Stage"("stage") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectArtefactScore" ADD CONSTRAINT "ProjectArtefactScore_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectArtefactScore" ADD CONSTRAINT "ProjectArtefactScore_artefactId_fkey" FOREIGN KEY ("artefactId") REFERENCES "Artefact"("artefact_id") ON DELETE RESTRICT ON UPDATE CASCADE;
