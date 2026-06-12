"use client";

import { Sparkles } from "lucide-react";

const courseCategories = [
  {
    title: "Ingliz tili (General)",
    icon: "🇬🇧",
    items: [
      { name: "Grammar (foundation)", duration: "2 oy", courseId: null },
      { name: "Beginner", duration: "1 oy", courseId: "ingliz-tili" },
      { name: "Elementary", duration: "2 oy", courseId: "ingliz-tili" },
      { name: "Pre-intermediate", duration: "2 oy", courseId: "ingliz-tili" },
      { name: "Grammar B1-B2", duration: "3 oy", courseId: null },
      { name: "Pre CEFR/IELTS", duration: "2 oy", courseId: null },
      { name: "IELTS", duration: "5 oy", courseId: "ielts" },
      { name: "CEFR", duration: "4 oy", courseId: "cefr" },
    ],
    note: "Individual va kechki kurslar: to'lov ko'rsatilgan narxlardan 2 barobar (2x) yuqori.",
  },
  {
    title: "So'zlashuv kurslari",
    icon: "🗣",
    items: [
      { name: "Speaking (guruhda)", duration: "", courseId: null },
      { name: "Speaking (individual)", duration: "", courseId: null },
    ],
  },
  {
    title: "Boshqa til kurslari",
    icon: "🌍",
    items: [
      { name: "Turk tili", duration: "3 oy", courseId: null },
      { name: "Koreys tili", duration: "3-6 oy", courseId: null },
      { name: "Nemis tili", duration: "3-6 oy", courseId: null },
      { name: "Rus tili (so'zlashuv)", duration: "3 oy", courseId: "rus-tili" },
    ],
  },
  {
    title: "Maktab fanlari",
    icon: "📚",
    items: [
      { name: "Ona tili – oddiy", duration: "6 oy", courseId: "ona-tili" },
      { name: "Matematika – oddiy", duration: "6 oy", courseId: "matematika" },
      { name: "Biologiya – oddiy", duration: "6 oy", courseId: "biologiya" },
      { name: "Kimyo – oddiy", duration: "6 oy", courseId: "kimyo" },
      { name: "Tarix – oddiy", duration: "6 oy", courseId: "tarix" },
      { name: "Huquq – oddiy", duration: "6 oy", courseId: "huquq" },
      { name: "Rus tili – oddiy", duration: "6 oy", courseId: "rus-tili" },
      { name: "Milliy sertifikat", duration: "3-5 oy", courseId: null },
    ],
  },
  {
    title: "Bolalar guruhlari (2-3-4 sinflar)",
    icon: "👶",
    items: [
      { name: "Ingliz tili", duration: "9 oy", courseId: "ingliz-tili" },
      { name: "Matematika", duration: "6 oy", courseId: "matematika" },
      { name: "Rus tili", duration: "6 oy", courseId: "rus-tili" },
      { name: "Koreys tili", duration: "6 oy", courseId: null },
      { name: "Prezident maktabi Matematika (PM)", duration: "5 oy", courseId: null },
    ],
  },
];

function openBot(courseId: string | null) {
  const url = courseId
    ? `https://t.me/todaylcbot?start=${courseId}`
    : "https://t.me/todaylcbot";
  window.location.href = url;
}

export function Enroll() {
  return (
    <section id="enroll" className="relative overflow-hidden bg-navy py-24 md:py-32">
      <div className="absolute inset-0 bg-grid opacity-[0.03]" />

      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-14 text-center">
          <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-gold/10 px-4 py-1.5 text-sm text-gold">
            <Sparkles size={14} />
            Mavjud kurslar
          </span>
          <h2
            className="font-heading text-4xl font-bold text-white md:text-5xl"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Kursga yozilish
          </h2>
          <p className="mt-4 text-lg text-white/50">
            Kurs nomini bosing va Telegram orqali ro&apos;yxatdan o&apos;ting
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {courseCategories.map((cat) => (
            <div
              key={cat.title}
              className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-all duration-300 hover:border-gold/30 hover:bg-white/[0.07]"
            >
              <div className="mb-4 flex items-center gap-3">
                <span className="text-2xl">{cat.icon}</span>
                <h3
                  className="font-heading text-lg font-bold text-white"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {cat.title}
                </h3>
              </div>

              <ul className="space-y-2">
                {cat.items.map((item) => (
                  <li
                    key={item.name}
                    role="button"
                    tabIndex={0}
                    onClick={() => openBot(item.courseId)}
                    onKeyDown={(e) => { if (e.key === "Enter") openBot(item.courseId); }}
                    className="flex cursor-pointer items-center justify-between rounded-lg px-2 py-1.5 text-sm transition-colors hover:bg-white/10"
                  >
                    <span className="text-white/70 group-hover:text-white">{item.name}</span>
                    {item.duration && (
                      <span className="ml-2 shrink-0 rounded-full bg-gold/10 px-2.5 py-0.5 text-xs font-medium text-gold">
                        {item.duration}
                      </span>
                    )}
                  </li>
                ))}
              </ul>

              {"note" in cat && cat.note && (
                <p className="mt-4 border-t border-white/10 pt-3 text-xs italic text-gold/60">
                  {cat.note}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
