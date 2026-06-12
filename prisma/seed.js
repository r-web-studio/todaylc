const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  const adminPassword = await bcrypt.hash("Admin2025!", 12);
  const superadminPassword = await bcrypt.hash("SuperAdmin2025!", 12);

  await prisma.user.upsert({
    where: { email: "admin@today.uz" },
    update: {},
    create: {
      name: "Admin",
      email: "admin@today.uz",
      passwordHash: adminPassword,
      role: "ADMIN",
    },
  });

  await prisma.user.upsert({
    where: { email: "superadmin@today.uz" },
    update: {},
    create: {
      name: "Super Admin",
      email: "superadmin@today.uz",
      passwordHash: superadminPassword,
      role: "SUPERADMIN",
    },
  });

  const courses = [
    { title: "IELTS", titleUz: "IELTS", description: "Xalqaro ingliz tili imtihoniga tayyorlov. Listening, reading, writing va speaking ko'nikmalari.", duration: "5 oy", price: 550000, branch: "BOTH" },
    { title: "CEFR", titleUz: "CEFR", description: "Evropa standartlari bo'yicha ingliz tili. A1 dan C1 darajasigacha to'liq ta'lim dasturi.", duration: "4 oy", price: 550000, branch: "BOTH" },
    { title: "English", titleUz: "Ingliz tili", description: "Umumiy ingliz tili kursi. Grammatika, so'zlashuv, tinglab tushunish va yozma nutq.", duration: "3 oy", price: 350000, branch: "BOTH" },
    { title: "Russian", titleUz: "Rus tili", description: "Rus tilida erkin muloqot qilish va grammatikani o'zlashtirish uchun tizimli kurs.", duration: "3 oy", price: 350000, branch: "BOTH" },
    { title: "History", titleUz: "Tarix", description: "DTM imtihonlari va olimpiadalarga puxta tayyorgarlik. Xronologik yondashuv.", duration: "6 oy", price: 350000, branch: "BOTH" },
    { title: "Law", titleUz: "Huquq", description: "Huquqiy savodxonlikni oshirish. Konstitutsiya, fuqarolik va jinoyat huquqi asoslari.", duration: "6 oy", price: 350000, branch: "BOTH" },
    { title: "Mathematics", titleUz: "Matematika", description: "Matematik fikrlashni rivojlantirish. Algebra, geometriya va mantiqiy masalalar.", duration: "6 oy", price: 350000, branch: "BOTH" },
    { title: "Physics", titleUz: "Fizika", description: "Fizika fanini chuqur o'rganish. Mexanika, elektr, optika va boshqa bo'limlar.", duration: "6 oy", price: 350000, branch: "BOTH" },
    { title: "Biology", titleUz: "Biologiya", description: "DTM imtihonlariga tayyorgarlik. Botanika, zoologiya, anatomiya va genetika.", duration: "6 oy", price: 350000, branch: "BOTH" },
    { title: "Chemistry", titleUz: "Kimyo", description: "Kimyoni nazariy va amaliy jihatdan o'rganish. Elementlar, reaksiyalar.", duration: "6 oy", price: 350000, branch: "BOTH" },
    { title: "Uzbek Language", titleUz: "Ona tili va adabiyoti", description: "Grammatika va adabiyot fanidan chuqur bilim. Imlo va ijodiy yozma ishlar.", duration: "6 oy", price: 350000, branch: "BOTH" },
  ];

  for (const course of courses) {
    await prisma.course.upsert({
      where: { id: course.title },
      update: {},
      create: course,
    });
  }

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
