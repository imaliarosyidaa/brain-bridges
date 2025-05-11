/*
  Warnings:

  - Changed the type of `files` on the `meetings` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `videos` on the `meetings` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "meetings" DROP COLUMN "files",
ADD COLUMN     "files" JSONB NOT NULL,
DROP COLUMN "videos",
ADD COLUMN     "videos" JSONB NOT NULL;
