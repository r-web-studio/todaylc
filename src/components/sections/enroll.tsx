"use client";

import { useState } from "react";
import { Send, CheckCircle, Loader2, AlertCircle } from "lucide-react";
import { courses } from "@/data/courses";

const BOT_USERNAME = "today_lc_bot";

export function Enroll() {
  const [form, setForm] = useState({ name: "", phone: "", course: "", branch: "Urganch" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim() || !form.course) {
      setError("Barcha maydonlarni to'ldiring");
      return;
    }
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/enroll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Xatolik yuz berdi");
        setLoading(false);
        return;
      }

      setSuccess(true);
      setForm({ name: "", phone: "", course: "", branch: "Urganch" });
      setLoading(false);
    } catch {
      setError("Serverga ulanishda xatolik");
      setLoading(false);
    }
  };

  if (success) {
    return (
      <section id="enroll" className="relative overflow-hidden bg-navy py-24 md:py-32">
        <div className="absolute inset-0 bg-grid opacity-[0.03]" />
        <div className="mx-auto max-w-lg px-6 text-center">
          <CheckCircle size={64} className="mx-auto mb-6 text-green" />
          <h2 className="font-heading text-4xl font-bold text-white md:text-5xl">
            Arizangiz qabul qilindi!
          </h2>
          <p className="mt-4 text-lg text-white/60">
            Tez orada siz bilan bog&apos;lanamiz.
          </p>
          <button
            onClick={() => setSuccess(false)}
            className="mt-8 inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3 text-sm text-white/70 transition-all hover:border-gold/50 hover:text-gold"
          >
            Yana ariza topshirish
          </button>
        </div>
      </section>
    );
  }

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
            Quyidagi forma orqali ro&apos;yxatdan o&apos;ting
          </p>
        </div>

        <div className="mx-auto max-w-xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Ismingiz"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-5 py-3.5 text-sm text-white placeholder-white/30 outline-none transition-all focus:border-gold/50 focus:bg-white/10 focus:ring-2 focus:ring-gold/20"
              />
            </div>

            <div>
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="Telefon raqamingiz"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-5 py-3.5 text-sm text-white placeholder-white/30 outline-none transition-all focus:border-gold/50 focus:bg-white/10 focus:ring-2 focus:ring-gold/20"
              />
            </div>

            <div>
              <select
                name="course"
                value={form.course}
                onChange={handleChange}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-5 py-3.5 text-sm text-white outline-none transition-all focus:border-gold/50 focus:bg-white/10 focus:ring-2 focus:ring-gold/20"
              >
                <option value="" disabled className="bg-navy text-white/50">
                  Kursni tanlang
                </option>
                {courses.map((c) => (
                  <option key={c.id} value={c.title} className="bg-navy text-white">
                    {c.icon} {c.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <select
                name="branch"
                value={form.branch}
                onChange={handleChange}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-5 py-3.5 text-sm text-white outline-none transition-all focus:border-gold/50 focus:bg-white/10 focus:ring-2 focus:ring-gold/20"
              >
                <option value="Urganch" className="bg-navy text-white">
                  Urganch
                </option>
              </select>
            </div>

            {error && (
              <div className="flex items-center gap-2 rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-400">
                <AlertCircle size={16} />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-gold to-gold-light px-6 py-3.5 text-sm font-bold text-navy shadow-lg shadow-gold/20 transition-all hover:shadow-xl hover:shadow-gold/30 disabled:opacity-50"
            >
              {loading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <>
                  <Send size={16} />
                  Yuborish
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="mb-3 text-sm text-white/30">Yoki Telegram bot orqali</p>
            <a
              href={`https://t.me/${BOT_USERNAME}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3 text-sm text-white/70 transition-all hover:border-gold/50 hover:text-gold"
            >
              <Send size={16} />
              Telegram botga o&apos;tish
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}