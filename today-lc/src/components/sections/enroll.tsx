"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CheckCircle2, Send, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { courses } from "@/data/courses";

const schema = z.object({
  name: z.string().min(2, "Ismingizni kiriting (kamida 2 harf)"),
  phone: z.string().regex(/^[\+\d\s\-\(\)]{7,20}$/, "Telefon raqamni to'g'ri kiriting"),
  course: z.string().min(1, "Kursni tanlang"),
  branch: z.string().min(1, "Filialni tanlang"),
});

type FormData = z.infer<typeof schema>;

export function Enroll() {
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      const res = await fetch("/api/enroll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const err = await res.json();
        alert(err.error || "Xatolik yuz berdi");
        return;
      }

      setSubmitted(true);
    } catch {
      alert("Serverga ulanishda xatolik. Iltimos qayta urinib ko'ring.");
    }
  };

  return (
    <section id="enroll" className="relative overflow-hidden bg-navy py-24 md:py-32">
      <div className="absolute inset-0 bg-grid opacity-[0.03]" />
      <motion.div
        className="absolute top-1/4 left-1/3 h-72 w-72 rounded-full bg-gold/5 blur-[100px]"
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 h-48 w-48 rounded-full bg-gold/5 blur-[80px]"
        animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.5, 0.2] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />

      <div className="mx-auto max-w-3xl px-6">
        <AnimatePresence mode="wait">
          {!submitted ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="mb-12 text-center"
              >
                <motion.span
                  animate={{ rotate: [0, 5, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="mb-4 inline-flex items-center gap-2 rounded-full bg-gold/10 px-4 py-1.5 text-sm text-gold"
                >
                  <Sparkles size={14} />
                  Birinchi dars bepul
                </motion.span>
                <h2
                  className="font-heading text-4xl font-bold text-white md:text-5xl"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  Bugun kursga yoziling!
                </h2>
                <p className="mt-4 text-lg text-white/50">
                  Birinchi dars bepul. Bizga qo&apos;ng&apos;iroq qiling yoki formani to&apos;ldiring.
                </p>
              </motion.div>

              <motion.form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-5"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <div className="grid gap-5 sm:grid-cols-2">
                  <motion.div whileHover={{ scale: 1.01 }} whileFocus={{ scale: 1.01 }}>
                    <input
                      {...register("name")}
                      placeholder="Ismingiz"
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-5 py-3.5 text-sm text-white placeholder-white/30 outline-none transition-all duration-300 focus:border-gold focus:bg-white/10 focus:ring-2 focus:ring-gold/20"
                    />
                    {errors.name && (
                      <motion.p
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-1.5 text-xs text-red-400"
                      >
                        {errors.name.message}
                      </motion.p>
                    )}
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.01 }} whileFocus={{ scale: 1.01 }}>
                    <input
                      {...register("phone")}
                      placeholder="Telefon raqamingiz"
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-5 py-3.5 text-sm text-white placeholder-white/30 outline-none transition-all duration-300 focus:border-gold focus:bg-white/10 focus:ring-2 focus:ring-gold/20"
                    />
                    {errors.phone && (
                      <motion.p
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-1.5 text-xs text-red-400"
                      >
                        {errors.phone.message}
                      </motion.p>
                    )}
                  </motion.div>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <motion.div whileHover={{ scale: 1.01 }}>
                    <select
                      {...register("course")}
                      defaultValue=""
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-5 py-3.5 text-sm text-white outline-none transition-all duration-300 focus:border-gold focus:bg-white/10 focus:ring-2 focus:ring-gold/20"
                      style={{ colorScheme: "dark" }}
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
                    {errors.course && (
                      <motion.p
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-1.5 text-xs text-red-400"
                      >
                        {errors.course.message}
                      </motion.p>
                    )}
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.01 }}>
                    <select
                      {...register("branch")}
                      defaultValue=""
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-5 py-3.5 text-sm text-white outline-none transition-all duration-300 focus:border-gold focus:bg-white/10 focus:ring-2 focus:ring-gold/20"
                      style={{ colorScheme: "dark" }}
                    >
                      <option value="" disabled className="bg-navy text-white/50">
                        Filialni tanlang
                      </option>
                      <option value="Urganch" className="bg-navy text-white">
                        Urganch
                      </option>
                    </select>
                    {errors.branch && (
                      <motion.p
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-1.5 text-xs text-red-400"
                      >
                        {errors.branch.message}
                      </motion.p>
                    )}
                  </motion.div>
                </div>

                <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                  <Button type="submit" loading={isSubmitting} size="lg" className="w-full">
                    <Send size={16} />
                    Yuborish
                  </Button>
                </motion.div>
              </motion.form>
            </motion.div>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="text-center"
            >
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gold/20"
              >
                <CheckCircle2 size={44} className="text-gold" />
              </motion.div>
              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="font-heading text-3xl font-bold text-gold md:text-4xl"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Arizangiz qabul qilindi!
              </motion.h2>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="mt-4 text-lg text-white/60"
              >
                Tez orada siz bilan bog&apos;lanamiz.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="mt-8"
              >
                <Button
                  variant="outline"
                  onClick={() => setSubmitted(false)}
                  className="border-gold/30 text-gold hover:bg-gold hover:text-navy"
                >
                  Qayta yozilish
                </Button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
