/*
  Warnings:

  - Added the required column `question` to the `Area` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Area" ADD COLUMN     "question" TEXT NOT NULL;
