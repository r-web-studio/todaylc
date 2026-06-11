"use client";

import { motion } from "framer-motion";
import { Phone, MapPin, Clock, Send, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

const branches = [
  {
    city: "Urganch",
    phone: "+998 95 223 00 65",
    phoneHref: "+998952230065",
    address: "Urganch shahri, Xorazm viloyati",
    hours: "Dushanba — Shanba: 09:00 – 21:00",
    mapUrl: "https://maps.google.com/?q=Urganch+Xorazm+Uzbekistan",
  },
  {
    city: "Shovot",
    phone: "+998 97 299 00 65",
    phoneHref: "+998972990065",
    address: "Shovot tumani, Xorazm viloyati",
    hours: "Dushanba — Shanba: 09:00 – 21:00",
    mapUrl: "https://maps.google.com/?q=Shovot+Xorazm+Uzbekistan",
  },
];

export function ContactSection() {
  return (
    <section id="contact" className="bg-white py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto mb-16 max-w-2xl text-center"
        >
          <h2 className="font-heading text-4xl font-bold text-primary md:text-5xl">Aloqa</h2>
          <p className="mt-4 text-lg text-muted-foreground">Biz bilan bog&apos;laning</p>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-2">
          {branches.map((b, i) => (
            <motion.div
              key={b.city}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              className="rounded-xl border bg-card p-8 shadow-sm"
            >
              <h3 className="font-heading text-xl font-bold text-primary mb-6">Filial — {b.city}</h3>
              <div className="space-y-4">
                <a href={`tel:${b.phoneHref}`} className="flex items-center gap-3 text-sm text-gray-600 hover:text-accent transition-colors">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/10 text-accent"><Phone size={16} /></span>
                  {b.phone}
                </a>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/5 text-primary"><MapPin size={16} /></span>
                  {b.address}
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/5 text-primary"><Clock size={16} /></span>
                  {b.hours}
                </div>
              </div>
              <Button variant="outline" size="sm" className="mt-6 gap-2" onClick={() => window.open(b.mapUrl, "_blank")}>
                Xaritada ko'rish <ExternalLink size={14} />
              </Button>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <a
            href="https://t.me/today_LC"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-primary/90"
          >
            <Send size={16} /> Telegram kanalimiz
          </a>
        </motion.div>
      </div>
    </section>
  );
}
