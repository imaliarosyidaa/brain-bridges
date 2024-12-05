-- CreateEnum
CREATE TYPE "Role" AS ENUM ('SISWA', 'PENGAJAR', 'ADMIN');

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT,
    "first_name" TEXT,
    "last_name" TEXT,
    "phone_number" TEXT,
    "description" TEXT,
    "photo" TEXT,
    "role" "Role" NOT NULL DEFAULT 'SISWA',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "classes" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "pengajar_id" INTEGER NOT NULL,
    "topic_id" INTEGER NOT NULL,

    CONSTRAINT "classes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "topics" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "topics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "meetings" (
    "id" SERIAL NOT NULL,
    "kelas_id" INTEGER NOT NULL,
    "tittle" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "vidio1" TEXT NOT NULL,
    "title_vid1" TEXT NOT NULL,
    "vidio2" TEXT,
    "title_vid2" TEXT,
    "vidio3" TEXT,
    "title_vid3" TEXT,
    "file_materi1" TEXT NOT NULL,
    "file_materi2" TEXT,
    "file_materi3" TEXT,

    CONSTRAINT "meetings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "kelas_siswa" (
    "id" SERIAL NOT NULL,
    "kelas_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "kelas_siswa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "assesments" (
    "id" SERIAL NOT NULL,
    "kelas_id" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "deadline" TIMESTAMP(3) NOT NULL,
    "description" TEXT NOT NULL,
    "file1" TEXT,
    "file2" TEXT,
    "file3" TEXT,

    CONSTRAINT "assesments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "books" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "cover" TEXT NOT NULL,
    "file" TEXT NOT NULL,

    CONSTRAINT "books_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Jawaban" (
    "id" SERIAL NOT NULL,
    "assesment_id" INTEGER NOT NULL,
    "jawaban" TEXT,
    "file" TEXT,
    "nilai" INTEGER,

    CONSTRAINT "Jawaban_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_SiswaClasses" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_SiswaClasses_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "classes_name_key" ON "classes"("name");

-- CreateIndex
CREATE INDEX "_SiswaClasses_B_index" ON "_SiswaClasses"("B");

-- AddForeignKey
ALTER TABLE "classes" ADD CONSTRAINT "classes_pengajar_id_fkey" FOREIGN KEY ("pengajar_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "classes" ADD CONSTRAINT "classes_topic_id_fkey" FOREIGN KEY ("topic_id") REFERENCES "topics"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "meetings" ADD CONSTRAINT "meetings_kelas_id_fkey" FOREIGN KEY ("kelas_id") REFERENCES "classes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kelas_siswa" ADD CONSTRAINT "kelas_siswa_kelas_id_fkey" FOREIGN KEY ("kelas_id") REFERENCES "classes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kelas_siswa" ADD CONSTRAINT "kelas_siswa_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assesments" ADD CONSTRAINT "assesments_kelas_id_fkey" FOREIGN KEY ("kelas_id") REFERENCES "classes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Jawaban" ADD CONSTRAINT "Jawaban_assesment_id_fkey" FOREIGN KEY ("assesment_id") REFERENCES "assesments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SiswaClasses" ADD CONSTRAINT "_SiswaClasses_A_fkey" FOREIGN KEY ("A") REFERENCES "classes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SiswaClasses" ADD CONSTRAINT "_SiswaClasses_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
