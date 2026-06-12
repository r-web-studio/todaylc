"use client";

import { motion } from "framer-motion";
import { Phone, MapPin, ExternalLink } from "lucide-react";

const branches = [
  {
    city: "Urganch",
    phone: "+998 95 223-00-65",
    phoneHref: "+998952230065",
    address: "Urganch shahri, Xorazm viloyati",
    mapUrl: "https://maps.app.goo.gl/uJVpQHA1wP3tYgdg8",
    img: "/images/atm.jpg",
  },
  {
    city: "Shovot",
    phone: "+998 95 223-00-65",
    phoneHref: "+998952230065",
    address: "Shovot tumani, Xorazm viloyati",
    mapUrl: "https://maps.app.goo.gl/Ae2Hnz1Uc9tpEQBZ7",
    img: "/images/atm.jpg",
  },
];

export function Branches() {
  return (
    <section id="branches" className="relative bg-soft-white py-24 md:py-32">
      <div className="absolute inset-0 overflow-hidden">
        <img
          src="/images/team.jpg"
          alt=""
          className="h-full w-full object-cover opacity-[0.04]"
          loading="lazy"
        />
      </div>
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
            Filiallarimiz
          </h2>
          <p className="mt-4 text-lg text-gray-500">Filialimiz sizga xizmat ko'rsatishdan mamnun</p>
        </motion.div>

        <div className="mx-auto max-w-lg">
          {branches.map((b, i) => (
            <motion.div
              key={b.city}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -6 }}
              className="group card-hover overflow-hidden rounded-2xl bg-white shadow-sm"
            >
              <div className="relative h-56 overflow-hidden bg-gray-100">
                <motion.img
                  src={b.img}
                  alt={`${b.city} filiali`}
                  width={600}
                  height={400}
                  loading="lazy"
                  className="h-full w-full object-cover"
                  whileHover={{ scale: 1.08 }}
                  transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                  onError={(e) => {
                    const t = e.target as HTMLImageElement;
                    t.style.display = "none";
                    const p = t.parentElement;
                    if (p) {
                      p.style.background = "linear-gradient(135deg, #0B1F3A, #132c52)";
                      p.style.display = "flex";
                      p.style.alignItems = "center";
                      p.style.justifyContent = "center";
                      const s = document.createElement("span");
                      s.textContent = "🏛";
                      s.style.fontSize = "3.5rem";
                      s.style.opacity = "0.3";
                      p.appendChild(s);
                    }
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                <h3
                  className="absolute bottom-5 left-6 font-heading text-2xl font-bold text-white drop-shadow-lg"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  Filial — {b.city}
                </h3>
              </div>

              <div className="p-6">
                <div className="mb-4 space-y-3">
                  <motion.a
                    href={`tel:${b.phoneHref}`}
                    whileHover={{ x: 4 }}
                    className="flex items-center gap-3 text-sm text-gray-600 transition-colors hover:text-gold"
                  >
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gold/10 text-gold">
                      <Phone size={15} />
                    </span>
                    {b.phone}
                  </motion.a>
                  <p className="flex items-center gap-3 text-sm text-gray-500">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-navy/5 text-navy">
                      <MapPin size={15} />
                    </span>
                    {b.address}
                  </p>
                </div>

                <motion.a
                  href={b.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center gap-2 rounded-full border border-navy/10 px-5 py-2.5 text-sm font-semibold text-navy transition-all hover:border-gold hover:bg-gold/5 hover:text-gold"
                >
                  Xaritada ko'rish
                  <ExternalLink size={14} />
                </motion.a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
