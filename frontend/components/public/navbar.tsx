"use client";

import { useState, useEffect } from "react";
import { Menu, X, GraduationCap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "#courses", label: "Kurslar" },
  { href: "#about", label: "Biz haqimizda" },
  { href: "#contact", label: "Aloqa" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled ? "bg-white/90 backdrop-blur-md shadow-sm" : "bg-transparent"
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <a href="#" className="flex items-center gap-2">
          <GraduationCap size={28} className="text-accent" />
          <span className="font-heading text-xl font-bold text-primary">Today</span>
        </a>

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((l) => (
            <a key={l.href} href={l.href} className="text-sm font-medium text-gray-600 transition-colors hover:text-accent">
              {l.label}
            </a>
          ))}
          <Button
            variant="accent"
            size="sm"
            onClick={() => document.getElementById("enroll")?.scrollIntoView({ behavior: "smooth" })}
          >
            Ro'yxatdan o'tish
          </Button>
        </nav>

        <button className="md:hidden" onClick={() => setOpen(!open)}>
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden border-t bg-white md:hidden"
          >
            <div className="flex flex-col gap-2 p-6">
              {navLinks.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-4 py-3 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 hover:text-accent"
                >
                  {l.label}
                </a>
              ))}
              <Button
                variant="accent"
                className="mt-2"
                onClick={() => {
                  setOpen(false);
                  document.getElementById("enroll")?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                Ro'yxatdan o'tish
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
