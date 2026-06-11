"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Sparkles } from "lucide-react";

const features = [
  {
    title: "7 yillik tajriba va ishonch",
    desc: "2018 yildan buyon minglab o'quvchilarga sifatli ta'lim berib kelmoqdamiz",
  },
  {
    title: "9 000+ muvaffaqiyatli o'quvchi",
    desc: "Bitiruvchilarimiz O'zbekiston va xorijiy oliygohlarga muvaffaqiyatli o'qishga kirdi",
  },
  {
    title: "Vazirlik bilan hamkorlik",
    desc: "Maktabgacha va maktab ta'limi vazirligi bilan birgalikda loyihalar amalga oshirmoqda",
  },
  {
    title: "Bepul sinov darslari va testlar",
    desc: "Har bir kursda birinchi dars bepul, muntazam bepul test sinovlari o'tkaziladi",
  },
];

export function WhyUs() {
  return (
    <section className="relative overflow-hidden bg-white py-24 md:py-32">
      <motion.div
        className="absolute top-0 right-0 -mt-40 -mr-40 h-80 w-80 rounded-full bg-gold/5 blur-[100px]"
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-0 left-0 -mb-40 -ml-40 h-80 w-80 rounded-full bg-navy/5 blur-[100px]"
        animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
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
            Bizning afzalliklarimiz
          </motion.span>
          <h2
            className="font-heading text-4xl font-bold text-navy md:text-5xl"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Nega aynan biz?
          </h2>
          <p className="mt-4 text-lg text-gray-500">7 yillik ishonch va sifat garovi</p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className="group card-hover rounded-2xl border border-gray-100 bg-soft-white p-8"
            >
              <motion.div
                className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-gold/10 text-gold"
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                <CheckCircle2 size={24} />
              </motion.div>
              <h3
                className="font-heading text-lg font-bold text-navy"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {f.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-gray-500">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
