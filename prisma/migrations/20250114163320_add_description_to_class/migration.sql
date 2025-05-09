/*
  Warnings:

  - Added the required column `description` to the `classes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `siswa_id` to the `jawaban` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "classes" ADD COLUMN     "description" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "jawaban" ADD COLUMN     "siswa_id" INTEGER NOT NULL;
