"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

const courses = [
  { id: "1", icon: "🌍", title: "IELTS", titleUz: "IELTS", description: "Xalqaro ingliz tili imtihoniga tayyorlov", duration: "4 oy", price: "550 000 UZS", branch: "Urganch & Shovot" },
  { id: "2", icon: "📋", title: "CEFR", titleUz: "CEFR", description: "Evropa standartlari bo'yicha ingliz tili", duration: "6 oy", price: "350 000 UZS", branch: "Urganch & Shovot" },
  { id: "3", icon: "🇬🇧", title: "Ingliz tili", titleUz: "Ingliz tili", description: "Boshlang'ichdan yuqori darajagacha", duration: "6 oy", price: "350 000 UZS", branch: "Urganch & Shovot" },
  { id: "4", icon: "🇷🇺", title: "Rus tili", titleUz: "Rus tili", description: "Muloqot va grammatika", duration: "6 oy", price: "350 000 UZS", branch: "Urganch & Shovot" },
  { id: "5", icon: "📖", title: "Tarix", titleUz: "Tarix", description: "DTM va olimpiada tayyorgarlik", duration: "4 oy", price: "350 000 UZS", branch: "Urganch & Shovot" },
  { id: "6", icon: "⚖️", title: "Huquq", titleUz: "Huquq", description: "Asosiy huquqiy bilimlar", duration: "4 oy", price: "350 000 UZS", branch: "Urganch & Shovot", isNew: true },
  { id: "7", icon: "➕", title: "Matematika", titleUz: "Matematika", description: "Mantiq va hisob", duration: "6 oy", price: "350 000 UZS", branch: "Urganch & Shovot" },
  { id: "8", icon: "⚗️", title: "Fizika", titleUz: "Fizika", description: "Nazariya va masala yechish", duration: "6 oy", price: "350 000 UZS", branch: "Urganch & Shovot" },
  { id: "9", icon: "🧬", title: "Biologiya", titleUz: "Biologiya", description: "DTM tayyorgarlik", duration: "6 oy", price: "350 000 UZS", branch: "Urganch & Shovot" },
  { id: "10", icon: "🧪", title: "Kimyo", titleUz: "Kimyo", description: "Amaliy va nazariy kurs", duration: "6 oy", price: "350 000 UZS", branch: "Urganch & Shovot" },
  { id: "11", icon: "📖", title: "Ona tili va adabiyoti", titleUz: "Ona tili va adabiyoti", description: "Grammatika va ijod", duration: "6 oy", price: "350 000 UZS", branch: "Urganch & Shovot" },
];

export function CourseGrid() {
  const [selected, setSelected] = useState<typeof courses[0] | null>(null);

  return (
    <section id="courses" className="bg-muted py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto mb-16 max-w-2xl text-center"
        >
          <h2 className="font-heading text-4xl font-bold text-primary md:text-5xl">Bizning kurslar</h2>
          <p className="mt-4 text-lg text-muted-foreground">11 xil yo&apos;nalishda professional ta&apos;lim</p>
        </motion.div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {courses.map((c, i) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05, duration: 0.5 }}
              onClick={() => setSelected(c)}
              className="group cursor-pointer rounded-xl border bg-white p-6 shadow-sm transition-all hover:shadow-md hover:-translate-y-1"
            >
              <div className="mb-4 flex items-center justify-between">
                <span className="text-3xl">{c.icon}</span>
                {c.isNew && <Badge variant="accent">Yangi</Badge>}
              </div>
              <h3 className="font-heading text-lg font-bold text-primary">{c.titleUz}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{c.description}</p>
              <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin size={12} /> {c.branch}
              </div>
              <p className="mt-3 font-semibold text-accent">{c.price}/oy</p>
              <div className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-all group-hover:gap-2.5">
                Batafsil <ArrowRight size={14} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-2xl">
              <span>{selected?.icon}</span> {selected?.titleUz}
            </DialogTitle>
            <DialogDescription className="text-base">{selected?.description}</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <BookOpen size={16} className="text-accent" /> <strong>Davomiyligi:</strong> {selected?.duration}
            </div>
            <div className="flex items-center gap-2 text-sm">
              <MapPin size={16} className="text-accent" /> <strong>Filial:</strong> {selected?.branch}
            </div>
            <p className="text-2xl font-bold text-accent">{selected?.price}/oy</p>
            <Button variant="accent" className="w-full" onClick={() => { setSelected(null); document.getElementById("enroll")?.scrollIntoView({ behavior: "smooth" }); }}>
              Ro'yxatdan o'tish <ArrowRight size={16} />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
