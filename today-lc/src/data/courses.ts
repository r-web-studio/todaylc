export interface Course {
  id: string;
  icon: string;
  title: string;
  description: string;
  longDescription: string;
  highlights: string[];
  isNew?: boolean;
}

export const courses: Course[] = [
  {
    id: "ielts",
    icon: "🌍",
    title: "IELTS",
    description: "Xalqaro ingliz tili imtihoniga tayyorlov",
    longDescription:
      "IELTS xalqaro ingliz tili imtihoniga yuqori natija bilan tayyorlanish uchun maxsus kurs. Tajribali ustozlar bilan har tomonlama tayyorgarlik: listening, reading, writing va speaking ko'nikmalari.",
    highlights: ["Haftada 4 marta dars", "Individual yondashuv", "Real imtihon simulyatsiyasi", "7.0+ ball kafolati"],
  },
  {
    id: "cefr",
    icon: "📋",
    title: "CEFR",
    description: "Evropa standartlari bo'yicha ingliz tili",
    longDescription:
      "CEFR xalqaro standartlari asosida ingliz tilini bosqichma-bosqich o'rganish. A1 dan C1 darajasigacha bo'lgan to'liq ta'lim dasturi.",
    highlights: ["Darajalar bo'yicha guruhlar", "Xalqaro sertifikat", "Interaktiv metodika", "Kommunikativ yondashuv"],
  },
  {
    id: "ingliz-tili",
    icon: "🇬🇧",
    title: "Ingliz tili",
    description: "Boshlang'ichdan yuqori darajagacha",
    longDescription:
      "Umumiy ingliz tili kursi — noldan boshlab professional darajagacha. Grammatika, so'zlashuv, tinglab tushunish va yozma nutq ko'nikmalari.",
    highlights: ["Boshlang'ich daraja mavjud", "Subhiy muloqot amaliyoti", "Zamonaviy darsliklar", "Haftalik testlar"],
  },
  {
    id: "rus-tili",
    icon: "🇷🇺",
    title: "Rus tili",
    description: "Muloqot va grammatika",
    longDescription:
      "Rus tilida erkin muloqot qilish va grammatikani mukammal o'zlashtirish uchun tizimli kurs. Kundalik hayot va ish uchun zarur bo'lgan barcha ko'nikmalar.",
    highlights: ["Amaliy muloqot", "Grammatik asoslar", "Audio va video materiallar", "Guruh va individual"],
  },
  {
    id: "tarix",
    icon: "📖",
    title: "Tarix",
    description: "DTM va olimpiada tayyorgarlik",
    longDescription:
      "Tarix fanidan DTM imtihonlari va olimpiadalarga puxta tayyorgarlik. Xronologik yondashuv, muhim sanalar va jarayonlarni tizimli o'rganish.",
    highlights: ["DTM formatida mashqlar", "Olimpiada topshiriqlari", "Murakkab mavzular tahlili", "Test bazasi"],
  },
  {
    id: "huquq",
    icon: "⚖️",
    title: "Huquq",
    description: "Asosiy huquqiy bilimlar",
    longDescription:
      "Huquqiy savodxonlikni oshirish va asosiy huquqiy bilimlarni egallash uchun maxsus kurs. Konstitutsiya, fuqarolik va jinoyat huquqi asoslari.",
    highlights: ["Huquqiy asoslar", "Amaliy vaziyatlar tahlili", "Zamonaviy qonunchilik", "DTM tayyorgarlik"],
    isNew: true,
  },
  {
    id: "matematika",
    icon: "➕",
    title: "Matematika",
    description: "Mantiq va hisob",
    longDescription:
      "Matematik fikrlashni rivojlantirish va mantiqiy masalalarni yechish ko'nikmalarini shakllantirish. Algebra, geometriya va mantiqiy masalalarni o'z ichiga oladi.",
    highlights: ["Mantiqiy fikrlash", "Masala yechish usullari", "DTM testlari", "Individual yondashuv"],
  },
  {
    id: "fizika",
    icon: "⚗️",
    title: "Fizika",
    description: "Nazariya va masala yechish",
    longDescription:
      "Fizika fanini chuqur o'rganish: nazariy bilimlar va amaliy masalalarni yechish ko'nikmalari. Mexanika, elektr, optika va boshqa bo'limlar.",
    highlights: ["Nazariy va amaliy", "Laboratoriya ishlari", "DTM tayyorgarlik", "Murakkab masalalar"],
  },
  {
    id: "biologiya",
    icon: "🧬",
    title: "Biologiya",
    description: "DTM tayyorgarlik",
    longDescription:
      "Biologiya fanidan DTM imtihonlariga tizimli tayyorgarlik. Botanika, zoologiya, anatomiya va genetika bo'limlari bo'yicha chuqur bilim.",
    highlights: ["To'liq DTM dasturi", "Virtual laboratoriya", "Testlar va tahlil", "Individual konsultatsiya"],
  },
  {
    id: "kimyo",
    icon: "🧪",
    title: "Kimyo",
    description: "Amaliy va nazariy kurs",
    longDescription:
      "Kimyoni nazariy va amaliy jihatdan o'rganish. Elementlar, reaksiyalar, hisoblash masalalari va laboratoriya tajribalari.",
    highlights: ["Amaliy tajribalar", "Hisoblash masalalari", "DTM formatida testlar", "Individual yondashuv"],
  },
  {
    id: "ona-tili",
    icon: "📖",
    title: "Ona tili va adabiyoti",
    description: "Grammatika va ijod",
    longDescription:
      "Ona tili grammatikasini mukammal o'zlashtirish va adabiyot fanidan chuqur bilim olish. Imlo, uslubiyat va ijodiy yozma ishlar.",
    highlights: ["Grammatik tahlil", "Ijodiy yozuv", "Adabiy tahlil", "DTM tayyorgarlik"],
  },
];

export interface Stat {
  icon: string;
  value: number;
  suffix?: string;
  label: string;
}

export const stats: Stat[] = [
  { icon: "🎓", value: 7, suffix: " yil", label: "Tajriba" },
  { icon: "👨‍🎓", value: 9000, suffix: "+", label: "O'quvchilar" },
  { icon: "📝", value: 15000, suffix: "+", label: "Bepul test ishtirokchilari" },
  { icon: "📊", value: 89, suffix: ".6%", label: "Muvaffaqiyat darajasi" },
  { icon: "🏫", value: 1, label: "Filial" },
];

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  text: string;
  initial: string;
}

export const testimonials: Testimonial[] = [
  {
    id: "1",
    name: "Sevinch R.",
    role: "IELTS bitiruvchisi, 2024",
    text: "IELTS kursida o'qib, 7.5 ball oldim. Today'dagi ustozlar tufayli orzuyimdagi universitetga hujjat topshirdim!",
    initial: "S",
  },
  {
    id: "2",
    name: "Javohir A.",
    role: "Matematika bitiruvchisi, 2024",
    text: "Matematika kursi menga DTM dan yuqori ball olishimda katta yordam berdi. Har bir mavzu puxta tushuntiriladi.",
    initial: "J",
  },
  {
    id: "3",
    name: "Nilufar X.",
    role: "Ota-ona",
    text: "Ingliz tili kursi bolamning maktabdagi o'zlashtirishini keskin yaxshiladi. Today jamoasiga katta rahmat!",
    initial: "N",
  },
  {
    id: "4",
    name: "Madina Q.",
    role: "Ota-ona",
    text: "TODAY Sovrini loyihasi orqali farzandimning bilim darajasini bepul sinab ko'rdik. Juda foydali tashabbus!",
    initial: "M",
  },
];
