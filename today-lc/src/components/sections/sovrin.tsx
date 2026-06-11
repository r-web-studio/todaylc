"use client";

import { motion } from "framer-motion";
import { ArrowRight, ExternalLink, Brain, Calculator, Globe, Sparkles } from "lucide-react";

const steps = [
  "testtoday.uz saytiga kiring",
  '"Maktab monitoringi" bo\'limini tanlang',
  "7 xonali variant raqamini kiriting",
  "Natijani ko'ring",
];

const breakdown = [
  { icon: Brain, label: "5 ta — Mantiqiy savollar" },
  { icon: Calculator, label: "10 ta — Matematika" },
  { icon: Globe, label: "10 ta — Ingliz tili" },
];

export function Sovrin() {
  return (
    <section id="sovrin" className="relative overflow-hidden bg-gold py-24 md:py-32">
      <div className="absolute inset-0 bg-grid opacity-[0.05]" />
      <motion.div
        className="absolute top-0 right-0 h-96 w-96 -translate-y-1/2 translate-x-1/2 rounded-full bg-white/10 blur-[100px]"
        animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-0 left-0 h-96 w-96 translate-y-1/2 -translate-x-1/2 rounded-full bg-white/10 blur-[100px]"
        animate={{ scale: [1.2, 1, 1.2], opacity: [0.4, 0.2, 0.4] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
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
            animate={{ rotate: [0, 5, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="mb-4 inline-flex items-center gap-2 rounded-full bg-navy/10 px-4 py-1.5 text-sm font-semibold text-navy"
          >
            <Sparkles size={14} />
            5-mavsum
          </motion.span>
          <h2
            className="font-heading text-4xl font-bold text-navy md:text-5xl"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            TODAY Sovrini — 5-mavsum
          </h2>
          <p className="mt-4 text-lg text-navy/70">
            3 yildan buyon maktablarda 15 000+ o'quvchidan bepul test sinovlari o'tkazib kelinmoqda
          </p>
        </motion.div>

        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-8"
          >
            <p className="text-base leading-relaxed text-navy/80 md:text-lg">
              Maqsad — o'quvchilarni qo'llab-quvvatlash va ota-onalarning e'tiborini kuchaytirish.
            </p>

            <motion.div
              whileHover={{ scale: 1.01 }}
              className="rounded-2xl bg-white/30 p-6 backdrop-blur-sm md:p-8"
            >
              <h3
                className="font-heading mb-4 text-lg font-bold text-navy"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Test tarkibi:
              </h3>
              <p className="mb-5 text-2xl font-bold text-navy">
                <span className="font-heading">25 ta savol</span>
                <span className="ml-2 text-base font-normal text-navy/60">— jami</span>
              </p>
              <ul className="space-y-3">
                {breakdown.map((item, i) => (
                  <motion.li
                    key={item.label}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.15 }}
                    className="flex items-center gap-3 text-navy/80"
                  >
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-navy/10">
                      <item.icon size={16} />
                    </span>
                    {item.label}
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            <motion.a
              href="http://testtoday.uz"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="group inline-flex items-center gap-2.5 rounded-full bg-navy px-8 py-4 text-base font-semibold text-gold shadow-lg shadow-navy/20 transition-all hover:bg-navy-light hover:shadow-xl hover:shadow-navy/30"
            >
              Natijani tekshirish
              <motion.span
                animate={{ x: [0, 4, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <ArrowRight size={18} />
              </motion.span>
            </motion.a>
          </motion.div>

          <div className="space-y-4">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ x: 8, transition: { duration: 0.2 } }}
                className="group flex items-center gap-5 rounded-2xl bg-white/50 p-5 backdrop-blur-sm transition-all hover:bg-white hover:shadow-lg hover:shadow-navy/10 cursor-default"
              >
                <motion.span
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-navy text-sm font-bold text-gold"
                  whileHover={{ scale: 1.15 }}
                >
                  {i + 1}
                </motion.span>
                <p className="text-sm font-medium text-navy md:text-base">{step}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
