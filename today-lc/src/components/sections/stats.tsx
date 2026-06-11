"use client";

import { motion } from "framer-motion";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { stats } from "@/data/courses";

const iconMap: Record<string, string> = {
  "🎓": "🎓",
  "👨‍🎓": "👨‍🎓",
  "📝": "📝",
  "📊": "📊",
  "🏫": "🏫",
};

export function Stats() {
  return (
    <section className="relative bg-navy overflow-hidden py-16 md:py-20">
      <div className="absolute inset-0 bg-grid opacity-[0.03]" />
      <motion.div
        className="absolute top-0 left-1/4 h-64 w-64 rounded-full bg-gold/5 blur-[100px]"
        animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-0 right-1/4 h-48 w-48 rounded-full bg-gold/5 blur-[80px]"
        animate={{ x: [0, -20, 0], y: [0, 30, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-5">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              whileHover={{ y: -6 }}
              className="group flex flex-col items-center text-center"
            >
              <motion.span
                className="mb-3 text-3xl"
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 3 + i * 0.5, repeat: Infinity, ease: "easeInOut", delay: i * 0.3 }}
              >
                {stat.icon}
              </motion.span>
              <div
                className="font-heading text-3xl font-bold text-white md:text-4xl"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                <AnimatedCounter value={stat.value} suffix={stat.suffix} />
              </div>
              <p className="mt-1.5 text-sm text-white/60">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
