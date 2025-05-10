/*
  Warnings:

  - The `files` column on the `meetings` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `videos` column on the `meetings` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "meetings" DROP COLUMN "files",
ADD COLUMN     "files" TEXT[],
DROP COLUMN "videos",
ADD COLUMN     "videos" TEXT[];
