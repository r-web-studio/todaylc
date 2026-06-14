"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type Language = "uz" | "ru" | "en";

const LANG_KEY = "today_lc_lang";

interface LangContext {
  lang: Language;
  setLang: (l: Language) => void;
}

const LangCtx = createContext<LangContext>({ lang: "uz", setLang: () => {} });

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>("uz");

  useEffect(() => {
    const stored = localStorage.getItem(LANG_KEY) as Language | null;
    if (stored && ["uz", "ru", "en"].includes(stored)) setLangState(stored);
  }, []);

  const setLang = (l: Language) => {
    setLangState(l);
    localStorage.setItem(LANG_KEY, l);
  };

  return <LangCtx.Provider value={{ lang, setLang }}>{children}</LangCtx.Provider>;
}

export const useLang = () => useContext(LangCtx);

// ─── UI Translations ───

const t: Record<string, { uz: string; ru: string; en: string }> = {
  available_courses: {
    uz: "Mavjud kurslar",
    ru: "Доступные курсы",
    en: "Available courses",
  },
  our_courses: {
    uz: "Bizning kurslar",
    ru: "Наши курсы",
    en: "Our courses",
  },
  professional_education: {
    uz: "Eng so'nggi metodikalar bo'yicha professional ta'lim",
    ru: "Профессиональное образование по самым современным методикам",
    en: "Professional education using the latest methodologies",
  },
  enroll_course: {
    uz: "Kursga yozilish",
    ru: "Записаться на курс",
    en: "Enroll in a course",
  },
  click_to_enroll: {
    uz: "Kurs nomini bosing va Telegram orqali ro'yxatdan o'ting",
    ru: "Нажмите на название курса и запишитесь через Telegram",
    en: "Click the course name and register via Telegram",
  },
  home: { uz: "Bosh sahifa", ru: "Главная", en: "Home" },
  courses: { uz: "Kurslar", ru: "Курсы", en: "Courses" },
  branches: { uz: "Filiallar", ru: "Филиалы", en: "Branches" },
  project: { uz: "Loyiha", ru: "Проект", en: "Project" },
  contact: { uz: "Aloqa", ru: "Контакты", en: "Contact" },
  enroll_now: { uz: "Kursga yozilish", ru: "Записаться", en: "Enroll now" },
  open_bot: { uz: "Telegram bot", ru: "Telegram бот", en: "Telegram bot" },
};

export function tr(key: string, lang: Language): string {
  return t[key]?.[lang] ?? key;
}

// ─── Course Data ───

export interface CourseItem {
  name: { uz: string; ru: string; en: string };
  duration: string;
  price: string;
  courseId?: string | null;
}

export interface CourseCategoryData {
  title: { uz: string; ru: string; en: string };
  icon: string;
  items: CourseItem[];
  note?: { uz: string; ru: string; en: string };
}

export const courseCategoriesData: CourseCategoryData[] = [
  {
    title: {
      uz: "Ingliz tili (General)",
      ru: "Английский язык (General)",
      en: "English (General)",
    },
    icon: "🇬🇧",
    items: [
      { name: { uz: "Grammar (foundation)", ru: "Grammar (foundation)", en: "Grammar (foundation)" }, duration: "2 oy", price: "400 000 so'm", courseId: null },
      { name: { uz: "Beginner", ru: "Beginner", en: "Beginner" }, duration: "1 oy", price: "400 000 so'm", courseId: "ingliz-tili" },
      { name: { uz: "Elementary", ru: "Elementary", en: "Elementary" }, duration: "2 oy", price: "400 000 so'm", courseId: "ingliz-tili" },
      { name: { uz: "Pre-intermediate", ru: "Pre-intermediate", en: "Pre-intermediate" }, duration: "2 oy", price: "450 000 so'm", courseId: "ingliz-tili" },
      { name: { uz: "Grammar B1-B2", ru: "Grammar B1-B2", en: "Grammar B1-B2" }, duration: "3 oy", price: "400 000 so'm", courseId: null },
      { name: { uz: "Pre CEFR/IELTS", ru: "Pre CEFR/IELTS", en: "Pre CEFR/IELTS" }, duration: "2 oy", price: "500 000 so'm", courseId: null },
      { name: { uz: "IELTS", ru: "IELTS", en: "IELTS" }, duration: "5 oy", price: "550 000 so'm", courseId: "ielts" },
      { name: { uz: "CEFR", ru: "CEFR", en: "CEFR" }, duration: "4 oy", price: "550 000 so'm", courseId: "cefr" },
    ],
    note: {
      uz: "Individual va kechki kurslar: to'lov ko'rsatilgan narxlardan 2 barobar (2x) yuqori.",
      ru: "Индивидуальные и вечерние курсы: оплата в 2 раза (2x) выше указанных цен.",
      en: "Individual and evening courses: payment is 2 times (2x) the above prices.",
    },
  },
  {
    title: {
      uz: "So'zlashuv kurslari",
      ru: "Разговорные курсы",
      en: "Speaking courses",
    },
    icon: "🗣",
    items: [
      { name: { uz: "Speaking (guruhda)", ru: "Speaking (в группе)", en: "Speaking (group)" }, duration: "", price: "500 000 so'm", courseId: null },
      { name: { uz: "Speaking (individual)", ru: "Speaking (индивидуально)", en: "Speaking (individual)" }, duration: "", price: "1 000 000 so'm", courseId: null },
    ],
  },
  {
    title: {
      uz: "Boshqa til kurslari",
      ru: "Другие языковые курсы",
      en: "Other language courses",
    },
    icon: "🌍",
    items: [
      { name: { uz: "Turk tili", ru: "Турецкий язык", en: "Turkish" }, duration: "3 oy", price: "500 000 so'm", courseId: null },
      { name: { uz: "Koreys tili", ru: "Корейский язык", en: "Korean" }, duration: "3-6 oy", price: "500 000 so'm", courseId: null },
      { name: { uz: "Nemis tili", ru: "Немецкий язык", en: "German" }, duration: "3-6 oy", price: "500 000 so'm", courseId: null },
      { name: { uz: "Rus tili (so'zlashuv)", ru: "Русский язык (разговорный)", en: "Russian (speaking)" }, duration: "3 oy", price: "400 000 so'm", courseId: "rus-tili" },
    ],
  },
  {
    title: {
      uz: "Maktab fanlari",
      ru: "Школьные предметы",
      en: "School subjects",
    },
    icon: "📚",
    items: [
      { name: { uz: "Ona tili – oddiy", ru: "Родной язык – обычный", en: "Mother tongue – regular" }, duration: "6 oy", price: "450 000 so'm", courseId: "ona-tili" },
      { name: { uz: "Matematika – oddiy", ru: "Математика – обычный", en: "Mathematics – regular" }, duration: "6 oy", price: "450 000 so'm", courseId: "matematika" },
      { name: { uz: "Biologiya – oddiy", ru: "Биология – обычный", en: "Biology – regular" }, duration: "6 oy", price: "450 000 so'm", courseId: "biologiya" },
      { name: { uz: "Kimyo – oddiy", ru: "Химия – обычный", en: "Chemistry – regular" }, duration: "6 oy", price: "450 000 so'm", courseId: "kimyo" },
      { name: { uz: "Tarix – oddiy", ru: "История – обычный", en: "History – regular" }, duration: "6 oy", price: "450 000 so'm", courseId: "tarix" },
      { name: { uz: "Huquq – oddiy", ru: "Право – обычный", en: "Law – regular" }, duration: "6 oy", price: "450 000 so'm", courseId: "huquq" },
      { name: { uz: "Rus tili – oddiy", ru: "Русский язык – обычный", en: "Russian – regular" }, duration: "6 oy", price: "450 000 so'm", courseId: "rus-tili" },
      { name: { uz: "Milliy sertifikat", ru: "Национальный сертификат", en: "National certificate" }, duration: "3-5 oy", price: "500 000 so'm", courseId: null },
    ],
  },
  {
    title: {
      uz: "Bolalar guruhlari (2-3-4 sinflar)",
      ru: "Детские группы (2-3-4 классы)",
      en: "Kids groups (grades 2-3-4)",
    },
    icon: "👶",
    items: [
      { name: { uz: "Ingliz tili", ru: "Английский язык", en: "English" }, duration: "9 oy", price: "350 000 so'm", courseId: "ingliz-tili" },
      { name: { uz: "Matematika", ru: "Математика", en: "Math" }, duration: "6 oy", price: "350 000 so'm", courseId: "matematika" },
      { name: { uz: "Rus tili", ru: "Русский язык", en: "Russian" }, duration: "6 oy", price: "350 000 so'm", courseId: "rus-tili" },
      { name: { uz: "Koreys tili", ru: "Корейский язык", en: "Korean" }, duration: "6 oy", price: "350 000 so'm", courseId: null },
      { name: { uz: "Prezident maktabi Matematika (PM)", ru: "Президентская школа Математика (PM)", en: "President school Math (PM)" }, duration: "5 oy", price: "450 000 so'm", courseId: null },
    ],
  },
];

export function getCourseCategories(lang: Language) {
  return courseCategoriesData.map((cat) => ({
    title: cat.title[lang],
    icon: cat.icon,
    items: cat.items.map((item) => ({
      name: item.name[lang],
      duration: item.duration,
      price: item.price,
      courseId: item.courseId,
    })),
    note: cat.note ? cat.note[lang] : undefined,
  }));
}
