"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-primary">
      <div className="absolute inset-0 bg-grid-gold opacity-30" />
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-accent/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />

      <div className="relative z-10 mx-auto max-w-4xl px-6 py-32 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="mb-6 inline-flex items-center gap-2 rounded-full bg-accent/10 px-4 py-1.5 text-sm text-accent">
            <Sparkles size={14} />
            7 yillik tajriba
          </span>

          <h1 className="font-heading text-5xl font-bold leading-tight text-white md:text-7xl">
            Kelajagingizni <br />
            <span className="text-accent">bugun</span> boshlang
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-white/60">
            Today Ta&apos;lim Markazi — IELTS, CEFR, matematika, fizika va boshqa yo&apos;nalishlarda
            professional ta&apos;lim. Urganch va Shovot filiallarida sizni kutamiz.
          </p>

          <div className="mt-10 flex items-center justify-center gap-4">
            <Button
              variant="accent"
              size="lg"
              className="gap-2"
              onClick={() => document.getElementById("enroll")?.scrollIntoView({ behavior: "smooth" })}
            >
              Kursga yozilish <ArrowRight size={18} />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-white/20 text-white hover:bg-white/10"
              onClick={() => document.getElementById("courses")?.scrollIntoView({ behavior: "smooth" })}
            >
              Kurslarni ko'rish
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
