/*
  Warnings:

  - You are about to drop the `Jawaban` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Jawaban" DROP CONSTRAINT "Jawaban_assesment_id_fkey";

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "refreshToken" TEXT;

-- DropTable
DROP TABLE "Jawaban";

-- CreateTable
CREATE TABLE "jawaban" (
    "id" SERIAL NOT NULL,
    "assesment_id" INTEGER NOT NULL,
    "jawaban" TEXT,
    "file" TEXT,
    "nilai" INTEGER,

    CONSTRAINT "jawaban_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SiswaClasses" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "SiswaClasses_pkey" PRIMARY KEY ("A","B")
);

-- AddForeignKey
ALTER TABLE "jawaban" ADD CONSTRAINT "jawaban_assesment_id_fkey" FOREIGN KEY ("assesment_id") REFERENCES "assesments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SiswaClasses" ADD CONSTRAINT "SiswaClasses_A_fkey" FOREIGN KEY ("A") REFERENCES "classes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SiswaClasses" ADD CONSTRAINT "SiswaClasses_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
