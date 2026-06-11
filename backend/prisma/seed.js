const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Clean existing data
  await prisma.auditLog.deleteMany();
  await prisma.enrollment.deleteMany();
  await prisma.course.deleteMany();
  await prisma.user.deleteMany();

  // Create admin users
  const superHash = await bcrypt.hash("SuperAdmin2025!", 12);
  const adminHash = await bcrypt.hash("Admin2025!", 12);

  const superadmin = await prisma.user.create({
    data: { name: "Super Admin", email: "superadmin@today.uz", passwordHash: superHash, role: "SUPERADMIN" },
  });
  const admin = await prisma.user.create({
    data: { name: "Admin User", email: "admin@today.uz", passwordHash: adminHash, role: "ADMIN" },
  });
  console.log(`✅ Created ${superadmin.email} (SUPERADMIN)`);
  console.log(`✅ Created ${admin.email} (ADMIN)`);

  // Create courses
  const courseData = [
    { title: "IELTS", titleUz: "IELTS", description: "Xalqaro ingliz tili imtihoniga yuqori natija bilan tayyorlanish. Listening, reading, writing va speaking ko'nikmalari.", duration: "4 oy", price: 550000, branch: "BOTH" },
    { title: "CEFR", titleUz: "CEFR", description: "Evropa standartlari bo'yicha ingliz tilini bosqichma-bosqich o'rganish. A1 dan C1 darajasigacha.", duration: "6 oy", price: 350000, branch: "BOTH" },
    { title: "English", titleUz: "Ingliz tili", description: "Umumiy ingliz tili kursi — noldan boshlab professional darajagacha. Grammatika, so'zlashuv, tinglab tushunish.", duration: "6 oy", price: 350000, branch: "BOTH" },
    { title: "Russian", titleUz: "Rus tili", description: "Rus tilida erkin muloqot qilish va grammatikani mukammal o'zlashtirish uchun tizimli kurs.", duration: "6 oy", price: 350000, branch: "BOTH" },
    { title: "History", titleUz: "Tarix", description: "Tarix fanidan DTM imtihonlari va olimpiadalarga puxta tayyorgarlik. Xronologik yondashuv.", duration: "4 oy", price: 350000, branch: "BOTH" },
    { title: "Law", titleUz: "Huquq", description: "Huquqiy savodxonlikni oshirish va asosiy huquqiy bilimlarni egallash uchun maxsus kurs.", duration: "4 oy", price: 350000, branch: "BOTH" },
    { title: "Mathematics", titleUz: "Matematika", description: "Matematik fikrlashni rivojlantirish va mantiqiy masalalarni yechish ko'nikmalarini shakllantirish.", duration: "6 oy", price: 350000, branch: "BOTH" },
    { title: "Physics", titleUz: "Fizika", description: "Fizika fanini chuqur o'rganish: nazariy bilimlar va amaliy masalalarni yechish ko'nikmalari.", duration: "6 oy", price: 350000, branch: "BOTH" },
    { title: "Biology", titleUz: "Biologiya", description: "Biologiya fanidan DTM imtihonlariga tizimli tayyorgarlik.", duration: "6 oy", price: 350000, branch: "BOTH" },
    { title: "Chemistry", titleUz: "Kimyo", description: "Kimyoni nazariy va amaliy jihatdan o'rganish. Elementlar, reaksiyalar, hisoblash masalalari.", duration: "6 oy", price: 350000, branch: "BOTH" },
    { title: "Uzbek Language", titleUz: "Ona tili va adabiyoti", description: "Ona tili grammatikasini mukammal o'zlashtirish va adabiyot fanidan chuqur bilim olish.", duration: "6 oy", price: 350000, branch: "BOTH" },
  ];

  const courses = [];
  for (const c of courseData) {
    const course = await prisma.course.create({ data: c });
    courses.push(course);
  }
  console.log(`✅ Created ${courses.length} courses`);

  // Create fake enrollments
  const firstNames = ["Ali", "Vali", "Sevinch", "Javohir", "Nilufar", "Madina", "Jasur", "Dilnoza", "Bobur", "Zarina", "Aziz", "Gulruh", "Shoxrux", "Malika", "Diyor"];
  const lastNames = ["Rahimov", "Karimov", "Abdullayeva", "Ismoilov", "Xasanova", "Qodirova", "Toshmatov", "Komilova", "Sodiqov", "Nazarova", "Yusupov", "Ergasheva", "Normatov", "Sobirova", "Ruziyev"];
  const statuses = ["PENDING", "CONFIRMED", "CANCELLED"];
  const branches = ["URGANCH", "SHOVOT"];

  const enrollments = [];
  for (let i = 0; i < 20; i++) {
    const firstName = firstNames[i % firstNames.length];
    const lastName = lastNames[i % lastNames.length];
    const course = courses[Math.floor(Math.random() * courses.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const branch = branches[Math.floor(Math.random() * branches.length)];
    const daysAgo = Math.floor(Math.random() * 60);

    const enrollment = await prisma.enrollment.create({
      data: {
        studentName: `${firstName} ${lastName}`,
        studentPhone: `+998${String(900000000 + Math.floor(Math.random() * 99999999)).slice(0, 9)}`,
        studentEmail: i % 3 === 0 ? `${firstName.toLowerCase()}.${lastName.toLowerCase()}@gmail.com` : null,
        courseId: course.id,
        branch,
        status,
        message: i % 4 === 0 ? "Kechki darslarga borishni xohlayman" : null,
        enrolledAt: new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000),
      },
    });
    enrollments.push(enrollment);
  }
  console.log(`✅ Created ${enrollments.length} enrollments`);
  console.log("🎉 Seeding complete!");
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
