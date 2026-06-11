"use client";

import { Send, ExternalLink, BookOpen } from "lucide-react";
import { courses } from "@/data/courses";

export function Enroll() {
  return (
    <section id="enroll" className="relative overflow-hidden bg-navy py-24 md:py-32">
      <div className="absolute inset-0 bg-grid opacity-[0.03]" />

      <div className="mx-auto max-w-5xl px-6">
        <div className="mb-14 text-center">
          <h2
            className="font-heading text-4xl font-bold text-white md:text-5xl"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Kursga yozilish
          </h2>
          <p className="mt-4 text-lg text-white/50">
            Kursni tanlang va Telegram orqali ro&apos;yxatdan o&apos;ting
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {courses.map((course) => (
            <div
              key={course.id}
              className="group relative cursor-pointer rounded-2xl border border-white/10 bg-white/5 p-5 transition-all duration-300 hover:border-gold/50 hover:bg-white/10 hover:shadow-lg hover:shadow-gold/5"
            >
              <div className="mb-3 flex items-center justify-between">
                <span className="text-2xl">{course.icon}</span>
                {course.isNew && (
                  <span className="rounded-full bg-gold/20 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-gold">
                    Yangi
                  </span>
                )}
              </div>

              <h3
                className="font-heading text-lg font-bold text-white"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {course.title}
              </h3>
              <p className="mt-1 text-xs leading-relaxed text-white/50 line-clamp-2">
                {course.description}
              </p>

              <p className="mt-3 text-sm font-semibold text-gold">
                {course.price}
              </p>

              <button
                onClick={() => window.open(`https://t.me/todaylcbot?start=${course.id}`, "_blank")}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-gold to-gold-light px-4 py-2.5 text-xs font-bold text-navy shadow-lg shadow-gold/20 transition-all duration-300 hover:shadow-xl hover:shadow-gold/30"
              >
                <Send size={14} />
                Telegram orqali yozilish
              </button>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <a
            href="https://t.me/todaylcbot"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3 text-sm text-white/70 transition-all hover:border-gold/50 hover:text-gold"
          >
            <BookOpen size={16} />
            Botdagi barcha kurslarni ko&apos;rish
            <ExternalLink size={14} />
          </a>
        </div>
      </div>
    </section>
  );
}