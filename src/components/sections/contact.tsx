"use client";

import { motion } from "framer-motion";
import { Phone, Send, Globe, MapPin, ExternalLink, Clock, Building2 } from "lucide-react";
import Link from "next/link";

const contacts = [
  {
    icon: Phone,
    label: "Urganch",
    href: "tel:+998952230065",
    value: "+998 95 223-00-65",
  },
  {
    icon: Phone,
    label: "Shovot",
    href: "tel:+998952230065",
    value: "+998 95 223-00-65",
  },
  {
    icon: Building2,
    label: "Manzil",
    href: "https://maps.google.com/?q=Urganch+Xorazm+Uzbekistan",
    value: "Urganch shahri, Xorazm viloyati",
  },
  {
    icon: Clock,
    label: "Ish vaqti",
    value: "Dushanba — Shanba: 09:00 – 21:00",
  },
  {
    icon: Send,
    label: "Telegram",
    href: "https://t.me/today_LC",
    value: "t.me/today_LC",
  },
  {
    icon: MapPin,
    label: "Instagram",
    href: "https://www.instagram.com/today_talim_markazi",
    value: "@today_talim_markazi",
  },
  {
    icon: Globe,
    label: "Test platformasi",
    href: "http://testtoday.uz",
    value: "testtoday.uz",
  },
];

export function Contact() {
  return (
    <section id="contact" className="bg-white py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto mb-16 max-w-2xl text-center"
        >
          <h2
            className="font-heading text-4xl font-bold text-navy md:text-5xl"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Aloqa
          </h2>
          <p className="mt-4 text-lg text-gray-500">Biz bilan bog&apos;laning</p>
        </motion.div>

        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-6"
          >
            {contacts.map((c, i) => (
              <motion.div
                key={c.label}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                whileHover={c.href ? { x: 6 } : undefined}
              >
                {c.href ? (
                  <Link
                    href={c.href}
                    target={c.href.startsWith("http") ? "_blank" : undefined}
                    rel={c.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="group flex items-center gap-4 rounded-2xl border border-gray-100 bg-soft-white p-5 transition-all hover:border-gold/30 hover:shadow-md"
                  >
                    <motion.span
                      whileHover={{ scale: 1.15, rotate: 5 }}
                      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gold/10 text-gold"
                    >
                      <c.icon size={20} />
                    </motion.span>
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
                        {c.label}
                      </p>
                      <p className="mt-0.5 text-sm font-semibold text-navy transition-colors group-hover:text-gold">
                        {c.value}
                      </p>
                    </div>
                    <ExternalLink
                      size={14}
                      className="ml-auto text-gray-300 transition-colors group-hover:text-gold"
                    />
                  </Link>
                ) : (
                  <div className="group flex cursor-default items-center gap-4 rounded-2xl border border-gray-100 bg-soft-white p-5">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gold/10 text-gold">
                      <c.icon size={20} />
                    </span>
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
                        {c.label}
                      </p>
                      <p className="mt-0.5 text-sm font-semibold text-navy">
                        {c.value}
                      </p>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ scale: 1.01 }}
            className="overflow-hidden rounded-2xl shadow-lg ring-1 ring-gray-100"
          >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d195683.53444202716!2d60.456383429518155!3d41.48606920985785!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x41dfaa583cb2d52d%3A0x8d197aabe1932fb4!2sUrganch%2C%20Xorazm%20Region%2C%20Uzbekistan!5e0!3m2!1sen!2s!4v1710000000000"
              width="100%"
              height="100%"
              className="min-h-[400px]"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Urganch, Xorazm"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
