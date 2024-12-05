-- DropForeignKey
ALTER TABLE "classes" DROP CONSTRAINT "classes_pengajar_id_fkey";

-- AlterTable
ALTER TABLE "classes" ALTER COLUMN "pengajar_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "classes" ADD CONSTRAINT "classes_pengajar_id_fkey" FOREIGN KEY ("pengajar_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
