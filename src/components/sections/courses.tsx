"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { useLang, getCourseCategories, tr } from "@/lib/i18n";

export function Courses() {
  const { lang } = useLang();
  const cats = getCourseCategories(lang);

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
            {tr("available_courses", lang)}
          </motion.span>
          <h2
            className="font-heading text-4xl font-bold text-navy md:text-5xl"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {tr("our_courses", lang)}
          </h2>
          <p className="mt-4 text-lg text-gray-500">
            {tr("professional_education", lang)}
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {cats.map((cat, i) => (
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
                    <span className="ml-2 shrink-0 whitespace-nowrap text-xs font-medium text-gold-dark">
                      {item.duration && `${item.duration} – `}{item.price}
                    </span>
                  </li>
                ))}
              </ul>

              {cat.note && (
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
