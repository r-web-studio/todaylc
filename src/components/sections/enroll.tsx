"use client";

import { Sparkles, ExternalLink } from "lucide-react";
import { useLang, getCourseCategories, tr } from "@/lib/i18n";

function openBot(courseId: string | null) {
  const url = courseId
    ? `https://t.me/todaylcbot?start=${courseId}`
    : "https://t.me/todaylcbot";
  window.location.href = url;
}

export function Enroll() {
  const { lang } = useLang();
  const cats = getCourseCategories(lang);

  return (
    <section id="enroll" className="relative overflow-hidden bg-navy py-24 md:py-32">
      <div className="absolute inset-0 bg-grid opacity-[0.03]" />

      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-14 text-center">
          <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-gold/10 px-4 py-1.5 text-sm text-gold">
            <Sparkles size={14} />
            {tr("available_courses", lang)}
          </span>
          <h2
            className="font-heading text-4xl font-bold text-white md:text-5xl"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {tr("enroll_course", lang)}
          </h2>
          <p className="mt-4 text-lg text-white/50">
            {tr("click_to_enroll", lang)}
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {cats.map((cat) => (
            <div
              key={cat.title}
              className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-all duration-300 hover:border-gold/30 hover:bg-white/[0.07]"
            >
              <div className="mb-4 flex items-center gap-3">
                <span className="text-2xl">{cat.icon}</span>
                <h3
                  className="font-heading text-lg font-bold text-white"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {cat.title}
                </h3>
              </div>

              <ul className="space-y-2">
                {cat.items.map((item) => (
                  <li
                    key={item.name}
                    role="button"
                    tabIndex={0}
                    onClick={() => openBot(item.courseId ?? null)}
                    onKeyDown={(e) => { if (e.key === "Enter") openBot(item.courseId ?? null); }}
                    className="flex cursor-pointer items-center justify-between rounded-lg px-2 py-1.5 text-sm transition-colors hover:bg-white/10"
                  >
                    <span className="text-white/70">{item.name}</span>
                    <span className="ml-2 shrink-0 whitespace-nowrap text-xs font-medium text-gold">
                      {item.duration && `${item.duration} – `}{item.price}
                    </span>
                  </li>
                ))}
              </ul>

              {cat.note && (
                <p className="mt-4 border-t border-white/10 pt-3 text-xs italic text-gold/60">
                  {cat.note}
                </p>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <button
            onClick={() => window.open("https://t.me/todaylcbot", "_blank")}
            className="inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3 text-sm text-white/70 transition-all hover:border-gold/50 hover:text-gold"
          >
            <ExternalLink size={16} />
            {tr("open_bot", lang)}
          </button>
        </div>
      </div>
    </section>
  );
}
