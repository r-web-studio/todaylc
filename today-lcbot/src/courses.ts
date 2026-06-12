import { Language } from './locales';
import { CourseInfo } from './types';

export const COURSE_KEYS = [
  'ielts', 'cefr', 'english', 'russian',
  'history', 'law', 'mathematics', 'physics',
  'biology', 'chemistry', 'mother_language',
] as const;

export type CourseKey = (typeof COURSE_KEYS)[number];

export const DEEP_LINK_MAP: Record<string, CourseKey> = {
  ielts: 'ielts',
  cefr: 'cefr',
  'ingliz-tili': 'english',
  'rus-tili': 'russian',
  tarix: 'history',
  huquq: 'law',
  matematika: 'mathematics',
  fizika: 'physics',
  biologiya: 'biology',
  kimyo: 'chemistry',
  'ona-tili': 'mother_language',
};

export const COURSE_ICONS: Record<CourseKey, string> = {
  ielts: '🌍',
  cefr: '📋',
  english: '🇬🇧',
  russian: '🇷🇺',
  history: '📖',
  law: '⚖️',
  mathematics: '➕',
  physics: '⚗️',
  biology: '🧬',
  chemistry: '🧪',
  mother_language: '📖',
};

export const COURSE_HIGHLIGHTS: Record<CourseKey, string[]> = {
  ielts: [
    'Haftada 4 marta dars',
    'Individual yondashuv',
    'Real imtihon simulyatsiyasi',
    '7.0+ ball kafolati',
  ],
  cefr: [
    'Darajalar bo\'yicha guruhlar',
    'Xalqaro sertifikat',
    'Interaktiv metodika',
    'Kommunikativ yondashuv',
  ],
  english: [
    'Boshlang\'ich daraja mavjud',
    'Subhiy muloqot amaliyoti',
    'Zamonaviy darsliklar',
    'Haftalik testlar',
  ],
  russian: [
    'Amaliy muloqot',
    'Grammatik asoslar',
    'Audio va video materiallar',
    'Guruh va individual',
  ],
  history: [
    'DTM formatida mashqlar',
    'Olimpiada topshiriqlari',
    'Murakkab mavzular tahlili',
    'Test bazasi',
  ],
  law: [
    'Huquqiy asoslar',
    'Amaliy vaziyatlar tahlili',
    'Zamonaviy qonunchilik',
    'DTM tayyorgarlik',
  ],
  mathematics: [
    'Mantiqiy fikrlash',
    'Masala yechish usullari',
    'DTM testlari',
    'Individual yondashuv',
  ],
  physics: [
    'Nazariy va amaliy',
    'Laboratoriya ishlari',
    'DTM tayyorgarlik',
    'Murakkab masalalar',
  ],
  biology: [
    'To\'liq DTM dasturi',
    'Virtual laboratoriya',
    'Testlar va tahlil',
    'Individual konsultatsiya',
  ],
  chemistry: [
    'Amaliy tajribalar',
    'Hisoblash masalalari',
    'DTM formatida testlar',
    'Individual yondashuv',
  ],
  mother_language: [
    'Grammatik tahlil',
    'Ijodiy yozuv',
    'Adabiy tahlil',
    'DTM tayyorgarlik',
  ],
};

export function getCourseInfo(courseKey: CourseKey, lang: Language, t: (key: string, vars?: Record<string, string | number>) => string): CourseInfo {
  const name = t(`courses.${courseKey}`);
  const description = t(`courses.descriptions.${courseKey}`);
  const price = t(`courses.prices.${courseKey}`);
  const duration = t(`courses.durations.${courseKey}`);

  return {
    id: courseKey,
    icon: COURSE_ICONS[courseKey],
    title: name,
    description,
    longDescription: description,
    highlights: COURSE_HIGHLIGHTS[courseKey],
    price,
    duration,
  };
}
