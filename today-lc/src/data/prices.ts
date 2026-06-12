export interface PricePlan {
  id: string;
  title: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  highlighted?: boolean;
}

export const pricePlans: PricePlan[] = [
  {
    id: "standard",
    title: "Standart",
    price: "350 000",
    period: "oyiga",
    description: "Asosiy kurslar uchun eng qulay narx",
    features: [
      "Haftada 3 marta dars",
      "Guruhli ta'lim",
      "O'quv materiallari",
      "Bepul sinov darsi",
    ],
  },
  {
    id: "premium",
    title: "Premium",
    price: "550 000",
    period: "oyiga",
    description: "IELTS va maxsus kurslar uchun",
    features: [
      "Haftada 4 marta dars",
      "Kichik guruhlar (5-8 kishi)",
      "Individual yondashuv",
      "Bepul test sinovlari",
      "Sertifikat",
    ],
    highlighted: true,
  },
  {
    id: "vip",
    title: "VIP",
    price: "900 000",
    period: "oyiga",
    description: "Individual darslar uchun maxsus paket",
    features: [
      "Haftada 5 marta dars",
      "1-to-1 individual",
      "Moslashuvchan jadval",
      "Shaxsiy o'quv rejasi",
      "Bepul test sinovlari",
      "Sertifikat",
    ],
  },
];
