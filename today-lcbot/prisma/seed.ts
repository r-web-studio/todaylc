import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  const existingCourses = await prisma.course.count();
  if (existingCourses > 0) {
    console.log(`Courses already exist (${existingCourses}), skipping seed.`);
    return;
  }

  const courses = [
    {
      title: 'IELTS',
      titleUz: 'IELTS',
      description: 'Xalqaro ingliz tili imtihoniga tayyorgarlik. Barcha 4 ko\'nikma bo\'yicha intensiv mashg\'ulotlar.',
      duration: '3-6 oy',
      price: 550000,
      branch: 'BOTH' as const,
    },
    {
      title: 'CEFR',
      titleUz: 'CEFR',
      description: 'CEFR xalqaro standarti bo\'yicha Ingliz tili darajasini oshirish.',
      duration: '4-8 oy',
      price: 350000,
      branch: 'BOTH' as const,
    },
    {
      title: 'English',
      titleUz: 'Ingliz tili',
      description: 'Boshlang\'ichdan yuqori darajagacha Ingliz tili kurslari.',
      duration: '6-12 oy',
      price: 350000,
      branch: 'BOTH' as const,
    },
    {
      title: 'Russian',
      titleUz: 'Rus tili',
      description: 'Rus tilini o\'rganish va rivojlantirish kurslari.',
      duration: '6-12 oy',
      price: 350000,
      branch: 'BOTH' as const,
    },
    {
      title: 'History',
      titleUz: 'Tarix',
      description: 'Jahon va O\'zbekiston tarixi fanidan chuqurlashtirilgan darslar.',
      duration: '4-6 oy',
      price: 350000,
      branch: 'BOTH' as const,
    },
    {
      title: 'Law',
      titleUz: 'Huquq',
      description: 'Huquqshunoslik asoslari va qonunchilik bo\'yicha bilimlar.',
      duration: '4-6 oy',
      price: 350000,
      branch: 'BOTH' as const,
    },
    {
      title: 'Mathematics',
      titleUz: 'Matematika',
      description: 'Matematika fanidan maktab va oliy o\'quv yurti dasturlari.',
      duration: '6-12 oy',
      price: 350000,
      branch: 'BOTH' as const,
    },
    {
      title: 'Physics',
      titleUz: 'Fizika',
      description: 'Fizika fanidan nazariy va amaliy mashg\'ulotlar.',
      duration: '6-12 oy',
      price: 350000,
      branch: 'BOTH' as const,
    },
    {
      title: 'Biology',
      titleUz: 'Biologiya',
      description: 'Biologiya fanidan to\'liq kurs.',
      duration: '6-12 oy',
      price: 350000,
      branch: 'BOTH' as const,
    },
    {
      title: 'Chemistry',
      titleUz: 'Kimyo',
      description: 'Kimyo fanidan laboratoriya va nazariy darslar.',
      duration: '6-12 oy',
      price: 350000,
      branch: 'BOTH' as const,
    },
    {
      title: 'Mother Language and Literature',
      titleUz: 'Ona tili va adabiyoti',
      description: 'Ona tili va adabiyot fanidan chuqurlashtirilgan ta\'lim.',
      duration: '4-6 oy',
      price: 350000,
      branch: 'BOTH' as const,
    },
  ];

  for (const course of courses) {
    await prisma.course.create({ data: course });
    console.log(`  Created course: ${course.title}`);
  }

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
