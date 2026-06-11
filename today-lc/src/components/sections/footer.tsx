"use client";

import { motion } from "framer-motion";
import { Send } from "lucide-react";
import Link from "next/link";

const quickLinks = [
  { href: "#hero", label: "Bosh sahifa" },
  { href: "#courses", label: "Kurslar" },
  { href: "#branches", label: "Filiallar" },
  { href: "#sovrin", label: "Loyiha" },
  { href: "#contact", label: "Aloqa" },
];

export function Footer() {
  return (
    <footer className="bg-navy">
      <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
        <div className="grid gap-10 md:grid-cols-3">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="mb-4 flex items-center gap-3">
              <motion.div
                whileHover={{ rotate: 5, scale: 1.05 }}
                className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-lg bg-gold/20 ring-1 ring-white/10"
              >
                <img
                  src="/images/today lc.jpg"
                  alt=""
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              </motion.div>
              <span
                className="font-heading text-xl font-bold text-white"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Today<span className="text-gold">LC</span>
              </span>
            </div>
            <p
              className="font-heading text-base italic text-gold/70"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              7 yildan buyon yoshlar bilan birga.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h4
              className="font-heading mb-5 text-sm font-bold text-white"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Tezkor havolalar
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((l) => (
                <motion.li key={l.href} whileHover={{ x: 4 }}>
                  <Link
                    href={l.href}
                    className="text-sm text-white/50 transition-colors hover:text-gold"
                  >
                    {l.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h4
              className="font-heading mb-5 text-sm font-bold text-white"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Biz bilan
            </h4>
            <div className="flex gap-3">
              <motion.a
                href="https://www.instagram.com/today_talim_markazi"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.12, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white/60 transition-colors hover:bg-gold hover:text-navy"
                aria-label="Instagram"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
              </motion.a>
              <motion.a
                href="https://t.me/today_LC"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.12, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white/60 transition-colors hover:bg-gold hover:text-navy"
                aria-label="Telegram"
              >
                <Send size={18} />
              </motion.a>
            </div>
          </motion.div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="border-t border-white/10"
      >
        <div className="mx-auto max-w-7xl px-6 py-5 text-center">
          <p className="text-sm text-white/40">
            &copy; {new Date().getFullYear()} Today Ta&apos;lim Markazi. Barcha huquqlar himoyalangan.
          </p>
        </div>
      </motion.div>
    </footer>
  );
}
