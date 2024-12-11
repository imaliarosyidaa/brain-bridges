-- CreateTable
CREATE TABLE "diskusi" (
    "id" SERIAL NOT NULL,
    "kelas_id" INTEGER NOT NULL,
    "message" TEXT NOT NULL,
    "user_id" INTEGER NOT NULL,
    "comment_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "parent_id" INTEGER,

    CONSTRAINT "diskusi_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "diskusi" ADD CONSTRAINT "diskusi_kelas_id_fkey" FOREIGN KEY ("kelas_id") REFERENCES "classes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "diskusi" ADD CONSTRAINT "diskusi_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "diskusi" ADD CONSTRAINT "diskusi_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "diskusi"("id") ON DELETE SET NULL ON UPDATE CASCADE;
