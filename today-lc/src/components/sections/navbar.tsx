"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/ui/language-switcher";
import { useLang, tr } from "@/lib/i18n";

const navLinkKeys = [
  { href: "#hero", key: "home" },
  { href: "#courses", key: "courses" },
  { href: "#branches", key: "branches" },
  { href: "#sovrin", key: "project" },
  { href: "#contact", key: "contact" },
];

export function Navbar() {
  const { lang } = useLang();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("#hero");
  const [lastScroll, setLastScroll] = useState(0);

  const navLinks = navLinkKeys.map((l) => ({ href: l.href, label: tr(l.key, lang) }));

  useEffect(() => {
    const onScroll = () => {
      const current = window.scrollY;
      setScrolled(current > 60);
      setHidden(current > 200 && current > lastScroll);
      setLastScroll(current);

      for (const link of navLinks) {
        const el = document.querySelector(link.href);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 150 && rect.bottom >= 150) {
            setActiveSection(link.href);
            break;
          }
        }
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [lastScroll, lang]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const handleNavClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileOpen(false);
    const target = document.querySelector(href);
    if (target) {
      const top = target.getBoundingClientRect().top + window.scrollY - 96;
      window.scrollTo({ top, behavior: "smooth" });
    }
  }, []);

  const scrollToEnroll = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setMobileOpen(false);
    const target = document.querySelector("#enroll");
    if (target) {
      const top = target.getBoundingClientRect().top + window.scrollY - 96;
      window.scrollTo({ top, behavior: "smooth" });
    }
  }, []);

  return (
    <motion.header
      initial={{ y: 0 }}
      animate={{ y: hidden && !mobileOpen ? -100 : 0 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        scrolled
          ? "glass-dark shadow-lg shadow-black/10"
          : "bg-transparent"
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-10">
        <a
          href="#hero"
          onClick={(e) => handleNavClick(e, "#hero")}
          className="flex items-center gap-3"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="relative h-10 w-10 overflow-hidden rounded-lg bg-gold/20 ring-1 ring-white/10"
          >
            <img
              src="/images/today lc.jpg"
              alt="Today LC"
              width={40}
              height={40}
              loading="lazy"
              className="h-full w-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          </motion.div>
          <span
            className="font-heading text-xl font-bold tracking-tight text-white"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Today<span className="text-gold">LC</span>
          </span>
        </a>

        <nav className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className={cn(
                "group relative text-sm font-medium transition-colors",
                activeSection === link.href ? "text-gold" : "text-white/70 hover:text-white"
              )}
            >
              {link.label}
              <span
                className={cn(
                  "absolute -bottom-1 left-0 h-0.5 bg-gold transition-all duration-300",
                  activeSection === link.href ? "w-full" : "w-0 group-hover:w-full"
                )}
              />
            </a>
          ))}
          <LanguageSwitcher />
          <Button size="sm" onClick={scrollToEnroll}>
            {tr("enroll_now", lang)}
          </Button>
        </nav>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="relative z-50 flex h-10 w-10 items-center justify-center rounded-lg text-white md:hidden"
          aria-label={mobileOpen ? "Yopish" : "Menyu"}
        >
          <AnimatePresence mode="wait">
            {mobileOpen ? (
              <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
                <X size={22} />
              </motion.span>
            ) : (
              <motion.span key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
                <Menu size={22} />
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-8 bg-navy md:hidden"
          >
            {navLinks.map((link, i) => (
              <motion.a
                key={link.href}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ scale: 1.05, color: "#E6A817" }}
                className={cn(
                  "font-heading text-3xl font-bold transition-colors",
                  activeSection === link.href ? "text-gold" : "text-white/80"
                )}
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {link.label}
              </motion.a>
            ))}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <LanguageSwitcher />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Button size="lg" onClick={scrollToEnroll}>
                {tr("enroll_now", lang)}
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
