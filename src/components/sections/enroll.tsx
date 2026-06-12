"use client";

import { Send, ExternalLink, Sparkles } from "lucide-react";

const courseCategories = [
  {
    title: "Ingliz tili (General)",
    icon: "🇬🇧",
    items: [
      { name: "Grammar (foundation)", duration: "2 oy" },
      { name: "Beginner", duration: "1 oy" },
      { name: "Elementary", duration: "2 oy" },
      { name: "Pre-intermediate", duration: "2 oy" },
      { name: "Grammar B1-B2", duration: "3 oy" },
      { name: "Pre CEFR/IELTS", duration: "2 oy" },
      { name: "IELTS", duration: "5 oy" },
      { name: "CEFR", duration: "4 oy" },
    ],
    note: "Individual va kechki kurslar: to'lov ko'rsatilgan narxlardan 2 barobar (2x) yuqori.",
  },
  {
    title: "So'zlashuv kurslari",
    icon: "🗣",
    items: [
      { name: "Speaking (guruhda)", duration: "" },
      { name: "Speaking (individual)", duration: "" },
    ],
  },
  {
    title: "Boshqa til kurslari",
    icon: "🌍",
    items: [
      { name: "Turk tili", duration: "3 oy" },
      { name: "Koreys tili", duration: "3-6 oy" },
      { name: "Nemis tili", duration: "3-6 oy" },
      { name: "Rus tili (so'zlashuv)", duration: "3 oy" },
    ],
  },
  {
    title: "Maktab fanlari",
    icon: "📚",
    items: [
      { name: "Ona tili – oddiy", duration: "6 oy" },
      { name: "Matematika – oddiy", duration: "6 oy" },
      { name: "Biologiya – oddiy", duration: "6 oy" },
      { name: "Kimyo – oddiy", duration: "6 oy" },
      { name: "Tarix – oddiy", duration: "6 oy" },
      { name: "Huquq – oddiy", duration: "6 oy" },
      { name: "Rus tili – oddiy", duration: "6 oy" },
      { name: "Milliy sertifikat", duration: "3-5 oy" },
    ],
  },
  {
    title: "Bolalar guruhlari (2-3-4 sinflar)",
    icon: "👶",
    items: [
      { name: "Ingliz tili", duration: "9 oy" },
      { name: "Matematika", duration: "6 oy" },
      { name: "Rus tili", duration: "6 oy" },
      { name: "Koreys tili", duration: "6 oy" },
      { name: "Prezident maktabi Matematika (PM)", duration: "5 oy" },
    ],
  },
];

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
            O&apos;zingizga mos kursni tanlang va Telegram orqali ro&apos;yxatdan o&apos;ting
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
                  <li key={item.name} className="flex items-center justify-between text-sm">
                    <span className="text-white/70">{item.name}</span>
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

        <div className="mt-12 text-center">
          <a
            href="https://t.me/todaylcbot"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-gold to-gold-light px-8 py-3.5 text-sm font-bold text-navy shadow-lg shadow-gold/20 transition-all duration-300 hover:shadow-xl hover:shadow-gold/30"
          >
            <Send size={16} />
            Telegram orqali yozilish
            <ExternalLink size={14} />
          </a>
          <p className="mt-4 text-xs text-white/40">
            Botga yozilib, kurs tanlang va murabbiylarimiz siz bilan bog&apos;lanadi
          </p>
        </div>
      </div>
    </section>
  );
}
