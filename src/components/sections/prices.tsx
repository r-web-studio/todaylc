"use client";

import { motion } from "framer-motion";
import { Check, Sparkles } from "lucide-react";
import { pricePlans } from "@/data/prices";
import { Button } from "@/components/ui/button";

export function Prices() {
  const scrollToEnroll = () => {
    const target = document.querySelector("#enroll");
    if (target) {
      const top = target.getBoundingClientRect().top + window.scrollY - 96;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  return (
    <section className="relative overflow-hidden bg-soft-white py-24 md:py-32">
      <div className="absolute inset-0 bg-grid opacity-[0.02]" />

      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto mb-16 max-w-2xl text-center"
        >
          <motion.span
            animate={{ rotate: [0, 10, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="mb-4 inline-flex items-center gap-2 rounded-full bg-gold/10 px-4 py-1.5 text-sm text-gold"
          >
            <Sparkles size={14} />
            Narxlar
          </motion.span>
          <h2
            className="font-heading text-4xl font-bold text-navy md:text-5xl"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Kurs narxlari
          </h2>
          <p className="mt-4 text-lg text-gray-500">
            Har bir kurs uchun qulay narxlar va moslashuvchan to&apos;lov tizimi
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-3">
          {pricePlans.map((plan, i) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className={`card-hover relative rounded-2xl border p-8 ${
                plan.highlighted
                  ? "border-gold bg-white shadow-lg shadow-gold/10"
                  : "border-gray-100 bg-white shadow-sm"
              }`}
            >
              {plan.highlighted && (
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                  className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gold px-4 py-1 text-xs font-bold text-navy"
                >
                  Eng ommabop
                </motion.div>
              )}

              <h3
                className="font-heading text-xl font-bold text-navy"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {plan.title}
              </h3>
              <p className="mt-1 text-sm text-gray-500">{plan.description}</p>

              <div className="my-6">
                <span className="font-heading text-4xl font-bold text-navy">
                  {plan.price}
                </span>
                <span className="ml-1.5 text-sm text-gray-400">UZS / {plan.period}</span>
              </div>

              <ul className="mb-8 space-y-3">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-gray-600">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gold/10">
                      <Check size={12} className="text-gold-dark" />
                    </span>
                    {f}
                  </li>
                ))}
              </ul>

              <Button
                onClick={scrollToEnroll}
                variant={plan.highlighted ? "primary" : "outline"}
                className={`w-full ${!plan.highlighted ? "border-navy/20 text-navy hover:bg-navy hover:text-white" : ""}`}
              >
                Kursga yozilish
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
