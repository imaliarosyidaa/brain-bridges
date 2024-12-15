/*
  Warnings:

  - You are about to drop the column `video1` on the `meetings` table. All the data in the column will be lost.
  - You are about to drop the column `video2` on the `meetings` table. All the data in the column will be lost.
  - You are about to drop the column `video3` on the `meetings` table. All the data in the column will be lost.
  - Added the required column `vidio1` to the `meetings` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "meetings" DROP COLUMN "video1",
DROP COLUMN "video2",
DROP COLUMN "video3",
ADD COLUMN     "vidio1" TEXT NOT NULL,
ADD COLUMN     "vidio2" TEXT,
ADD COLUMN     "vidio3" TEXT;
