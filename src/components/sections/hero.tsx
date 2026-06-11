"use client";

import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

function useScrollY() {
  const [scrollY, setScrollY] = useState(0);
  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return scrollY;
}

function FloatingOrbs() {
  const orbs = useMemo(
    () =>
      Array.from({ length: 6 }).map((_, i) => ({
        x: 10 + Math.random() * 80,
        y: 10 + Math.random() * 80,
        size: 40 + Math.random() * 80,
        delay: Math.random() * 3,
        duration: 4 + Math.random() * 4,
      })),
    []
  );

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {orbs.map((orb, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-gold/5 blur-3xl"
          style={{
            left: `${orb.x}%`,
            top: `${orb.y}%`,
            width: orb.size,
            height: orb.size,
          }}
          animate={{
            y: [0, -30, 0, 20, 0],
            opacity: [0.3, 0.6, 0.3, 0.5, 0.3],
            scale: [1, 1.1, 1, 0.95, 1],
          }}
          transition={{
            duration: orb.duration,
            delay: orb.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

export function Hero() {
  const [imgLoaded, setImgLoaded] = useState(true);
  const scrollY = useScrollY();

  const scrollTo = (selector: string) => {
    const target = document.querySelector(selector);
    if (target) {
      const top = target.getBoundingClientRect().top + window.scrollY - 96;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <motion.img
          src="/images/team.jpg"
          alt=""
          className="h-full w-full object-cover"
          style={{ y: scrollY * 0.15 }}
          onError={(e) => {
            setImgLoaded(false);
            (e.target as HTMLImageElement).style.display = "none";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-navy/92 via-navy/80 to-navy/95" />
        <div className="absolute inset-0 bg-grid opacity-40" />
        <div className="absolute inset-0 bg-gold-glow opacity-60" />
      </div>

      {!imgLoaded && (
        <div className="absolute inset-0 bg-gradient-to-br from-navy via-navy-dark to-navy">
          <div className="absolute inset-0 bg-grid opacity-30" />
        </div>
      )}

      <FloatingOrbs />

      <div className="relative z-10 mx-auto max-w-5xl px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.div
            animate={{ boxShadow: ["0 0 0px rgba(230,168,23,0)", "0 0 20px rgba(230,168,23,0.3)", "0 0 0px rgba(230,168,23,0)"] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-gold/20 bg-gold/10 px-4 py-1.5 text-sm text-gold backdrop-blur-sm"
          >
            <Sparkles size={14} />
            <span>7 yildan buyon ishonch bilan</span>
          </motion.div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="font-heading text-5xl font-extrabold leading-[1.1] tracking-tight text-white sm:text-6xl md:text-7xl lg:text-8xl"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Kelajagingizni <br />
          <span className="bg-gradient-to-r from-gold via-gold-light to-gold bg-[length:200%_auto] animate-gradient-x bg-clip-text text-transparent">
            bugun boshlang
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-white/70 sm:text-xl"
        >
          7 yildan buyon yoshlarga eng ko'p imkoniyat beruvchi ta'lim markazi — Urganchda
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
        >
          <Button size="lg" onClick={() => scrollTo("#enroll")}>
            Kursga yozilish
            <ArrowRight size={18} />
          </Button>
          <Button variant="outline" size="lg" onClick={() => scrollTo("#courses")}>
            Batafsil
          </Button>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-2"
        >
          <span className="text-xs font-medium uppercase tracking-widest text-white/30">Scroll</span>
          <div className="flex h-10 w-6 items-start justify-center rounded-full border-2 border-white/20 p-1.5">
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="h-2 w-1.5 rounded-full bg-gold"
            />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
