-- AlterTable
ALTER TABLE "meetings" ALTER COLUMN "files" SET NOT NULL,
ALTER COLUMN "files" SET DATA TYPE TEXT,
ALTER COLUMN "videos" SET NOT NULL,
ALTER COLUMN "videos" SET DATA TYPE TEXT;
