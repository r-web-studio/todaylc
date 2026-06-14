"use client";

import { useLang, type Language } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const flags: Record<Language, string> = {
  uz: "🇺🇿",
  ru: "🇷🇺",
  en: "🇬🇧",
};

const labels: Record<Language, string> = {
  uz: "O'zbek",
  ru: "Русский",
  en: "English",
};

export function LanguageSwitcher() {
  const { lang, setLang } = useLang();

  const langs: Language[] = ["uz", "ru", "en"];

  return (
    <div className="flex items-center gap-1 rounded-full border border-white/10 bg-white/5 p-0.5">
      {langs.map((l) => (
        <button
          key={l}
          onClick={() => setLang(l)}
          className={cn(
            "flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium transition-all",
            lang === l
              ? "bg-gold text-navy shadow-sm"
              : "text-white/60 hover:text-white"
          )}
        >
          <span className="text-sm leading-none">{flags[l]}</span>
          <span className="hidden sm:inline">{labels[l]}</span>
        </button>
      ))}
    </div>
  );
}
