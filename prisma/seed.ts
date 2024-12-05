import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Generate password hash
  const password = await bcrypt.hash('password123', 10);

  // Create 20 pengajar
  for (let i = 1; i <= 20; i++) {
    await prisma.user.create({
      data: {
        email: `pengajar${i}@example.com`,
        password,
        first_name: `Pengajar`,
        last_name: `Ke-${i}`,
        phone_number: `0812345678${i}`,
        description: `Deskripsi pengajar ${i}`,
        role: Role.PENGAJAR,
      },
    });
  }

  // Create 15 siswa
  for (let i = 1; i <= 15; i++) {
    await prisma.user.create({
      data: {
        email: `siswa${i}@example.com`,
        password,
        first_name: `Siswa`,
        last_name: `Ke-${i}`,
        phone_number: `0812345679${i}`,
        description: `Deskripsi siswa ${i}`,
        role: Role.SISWA,
      },
    });
  }

  // Create 5 admin
  for (let i = 1; i <= 5; i++) {
    await prisma.user.create({
      data: {
        email: `admin${i}@example.com`,
        password,
        first_name: `Admin`,
        last_name: `Ke-${i}`,
        phone_number: `0812345670${i}`,
        description: `Deskripsi admin ${i}`,
        role: Role.ADMIN,
      },
    });
  }

  console.log('Seeding completed!');

  const topics = [
    { id: 1, name: 'Sains Teknologi' },
    { id: 2, name: 'Social Science' },
    { id: 3, name: 'Computer Science' },
  ];

  // Insert topics ke database
  for (const topic of topics) {
    await prisma.topic.upsert({
      where: { id: topic.id },
      update: {},
      create: topic,
    });
  }

  console.log('Seeding selesai untuk tabel topics!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
