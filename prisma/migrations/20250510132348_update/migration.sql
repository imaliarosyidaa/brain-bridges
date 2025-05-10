/*
  Warnings:

  - You are about to drop the column `file_materi1` on the `meetings` table. All the data in the column will be lost.
  - You are about to drop the column `file_materi2` on the `meetings` table. All the data in the column will be lost.
  - You are about to drop the column `file_materi3` on the `meetings` table. All the data in the column will be lost.
  - You are about to drop the column `summary` on the `meetings` table. All the data in the column will be lost.
  - You are about to drop the column `title_vid1` on the `meetings` table. All the data in the column will be lost.
  - You are about to drop the column `title_vid2` on the `meetings` table. All the data in the column will be lost.
  - You are about to drop the column `title_vid3` on the `meetings` table. All the data in the column will be lost.
  - You are about to drop the column `vidio1` on the `meetings` table. All the data in the column will be lost.
  - You are about to drop the column `vidio2` on the `meetings` table. All the data in the column will be lost.
  - You are about to drop the column `vidio3` on the `meetings` table. All the data in the column will be lost.
  - Added the required column `files` to the `meetings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `videos` to the `meetings` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "meetings" DROP COLUMN "file_materi1",
DROP COLUMN "file_materi2",
DROP COLUMN "file_materi3",
DROP COLUMN "summary",
DROP COLUMN "title_vid1",
DROP COLUMN "title_vid2",
DROP COLUMN "title_vid3",
DROP COLUMN "vidio1",
DROP COLUMN "vidio2",
DROP COLUMN "vidio3",
ADD COLUMN     "files" TEXT NOT NULL,
ADD COLUMN     "videos" TEXT NOT NULL;
