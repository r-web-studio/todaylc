"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight, CheckCircle2 } from "lucide-react";
import type { Course } from "@/data/courses";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface CourseModalProps {
  course: Course | null;
  onClose: () => void;
}

export function CourseModal({ course, onClose }: CourseModalProps) {
  useEffect(() => {
    if (course) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [course]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  const scrollToEnroll = () => {
    onClose();
    setTimeout(() => {
      const target = document.querySelector("#enroll");
      if (target) {
        const top = target.getBoundingClientRect().top + window.scrollY - 96;
        window.scrollTo({ top, behavior: "smooth" });
      }
    }, 300);
  };

  return (
    <AnimatePresence>
      {course && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition-colors hover:bg-gray-200 hover:text-gray-700"
              aria-label="Yopish"
            >
              <X size={16} />
            </button>

            <div className="bg-gradient-to-br from-navy to-navy-light px-8 pb-8 pt-10 text-center">
              <span className="mb-3 inline-block text-5xl">{course.icon}</span>
              <h3
                className="font-heading text-3xl font-bold text-white"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {course.title}
              </h3>
              {course.isNew && (
                <div className="mt-3">
                  <Badge variant="new">Yangi kurs!</Badge>
                </div>
              )}
            </div>

            <div className="px-8 py-6">
              <p className="text-base leading-relaxed text-gray-600">
                {course.longDescription}
              </p>

              <div className="mt-6">
                <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-400">
                  Kurs xususiyatlari
                </h4>
                <ul className="space-y-2.5">
                  {course.highlights.map((h) => (
                    <li key={h} className="flex items-start gap-2.5 text-sm text-gray-600">
                      <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-green" />
                      {h}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8 flex gap-3">
                <Button onClick={scrollToEnroll} className="flex-1">
                  Kursga yozilish
                  <ArrowRight size={16} />
                </Button>
                <button
                  onClick={onClose}
                  className="shrink-0 rounded-full border-2 border-gray-200 px-6 py-3 text-sm font-semibold text-gray-600 transition-all hover:border-gray-300 hover:bg-gray-50 hover:text-gray-800"
                >
                  Yopish
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
