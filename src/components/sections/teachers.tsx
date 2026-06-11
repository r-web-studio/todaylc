"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { teachers } from "@/data/teachers";

const avatarColors = [
  "bg-gold text-navy",
  "bg-blue-500 text-white",
  "bg-emerald-500 text-white",
  "bg-purple-500 text-white",
];

export function Teachers() {
  return (
    <section className="relative overflow-hidden bg-white py-24 md:py-32">
      <motion.div
        className="absolute top-0 left-0 -mt-32 -ml-32 h-80 w-80 rounded-full bg-navy/5 blur-[100px]"
        animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      />

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
            Tajribali jamoa
          </motion.span>
          <h2
            className="font-heading text-4xl font-bold text-navy md:text-5xl"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Ustozlarimiz
          </h2>
          <p className="mt-4 text-lg text-gray-500">
            Har bir ustoz o&apos;z sohasining professionali
          </p>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {teachers.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className="group card-hover rounded-2xl border border-gray-100 bg-soft-white p-8 text-center"
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                className={`mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full text-lg font-bold ${avatarColors[i % avatarColors.length]}`}
              >
                {t.initial}
              </motion.div>
              <h3
                className="font-heading text-lg font-bold text-navy"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {t.name}
              </h3>
              <p className="mt-1.5 text-sm font-medium text-gold">{t.subject}</p>
              <p className="mt-2 text-xs leading-relaxed text-gray-400">{t.credential}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
