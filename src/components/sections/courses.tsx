"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

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

export function Courses() {
  return (
    <section id="courses" className="relative bg-soft-white py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto mb-16 max-w-2xl text-center"
        >
          <motion.span
            animate={{ rotate: [0, 10, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="mb-4 inline-flex items-center gap-2 rounded-full bg-gold/10 px-4 py-1.5 text-sm text-gold"
          >
            <Sparkles size={14} />
            Mavjud kurslar
          </motion.span>
          <h2
            className="font-heading text-4xl font-bold text-navy md:text-5xl"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Bizning kurslar
          </h2>
          <p className="mt-4 text-lg text-gray-500">
            Eng so'nggi metodikalar bo'yicha professional ta'lim
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {courseCategories.map((cat, i) => (
            <motion.div
              key={cat.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all duration-300 hover:border-gold/30 hover:shadow-lg"
            >
              <div className="mb-4 flex items-center gap-3">
                <span className="text-2xl">{cat.icon}</span>
                <h3
                  className="font-heading text-lg font-bold text-navy"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {cat.title}
                </h3>
              </div>

              <ul className="space-y-2">
                {cat.items.map((item) => (
                  <li key={item.name} className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">{item.name}</span>
                    {item.duration && (
                      <span className="ml-2 shrink-0 rounded-full bg-gold/10 px-2.5 py-0.5 text-xs font-medium text-gold-dark">
                        {item.duration}
                      </span>
                    )}
                  </li>
                ))}
              </ul>

              {"note" in cat && cat.note && (
                <p className="mt-4 border-t border-gray-100 pt-3 text-xs italic text-gold/70">
                  {cat.note}
                </p>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
