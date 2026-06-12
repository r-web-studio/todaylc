"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen, MapPin, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import api from "@/lib/api";

const emojiMap: Record<string, string> = {
  "IELTS": "🌍",
  "CEFR": "📋",
  "English": "🇬🇧",
  "Ingliz tili": "🇬🇧",
  "Russian": "🇷🇺",
  "Rus tili": "🇷🇺",
  "History": "📖",
  "Tarix": "📖",
  "Law": "⚖️",
  "Huquq": "⚖️",
  "Mathematics": "➕",
  "Matematika": "➕",
  "Physics": "⚗️",
  "Fizika": "⚗️",
  "Biology": "🧬",
  "Biologiya": "🧬",
  "Chemistry": "🧪",
  "Kimyo": "🧪",
  "Uzbek Language": "📖",
  "Ona tili va adabiyoti": "📖",
};

const getEmoji = (title: string, titleUz?: string) => {
  return emojiMap[title] || (titleUz && emojiMap[titleUz]) || "🎓";
};

const formatBranch = (branch: string) => {
  if (branch === "BOTH") return "Urganch & Shovot";
  if (branch === "URGANCH") return "Urganch";
  if (branch === "SHOVOT") return "Shovot";
  return branch;
};

// Fallback courses in case database isn't populated or offline
const fallbackCourses = [
  { id: "fallback-1", icon: "🌍", title: "IELTS", titleUz: "IELTS", description: "Xalqaro ingliz tili imtihoniga tayyorlov", duration: "4 oy", price: 550000, branch: "BOTH" },
  { id: "fallback-2", icon: "📋", title: "CEFR", titleUz: "CEFR", description: "Evropa standartlari bo'yicha ingliz tili", duration: "6 oy", price: 350000, branch: "BOTH" },
  { id: "fallback-3", icon: "🇬🇧", title: "Ingliz tili", titleUz: "Ingliz tili", description: "Boshlang'ichdan yuqori darajagacha", duration: "6 oy", price: 350000, branch: "BOTH" },
  { id: "fallback-4", icon: "🇷🇺", title: "Rus tili", titleUz: "Rus tili", description: "Muloqot va grammatika", duration: "6 oy", price: 350000, branch: "BOTH" },
  { id: "fallback-5", icon: "📖", title: "Tarix", titleUz: "Tarix", description: "DTM va olimpiada tayyorgarlik", duration: "4 oy", price: 350000, branch: "BOTH" },
  { id: "fallback-6", icon: "⚖️", title: "Huquq", titleUz: "Huquq", description: "Asosiy huquqiy bilimlar", duration: "4 oy", price: 350000, branch: "BOTH" },
  { id: "fallback-7", icon: "➕", title: "Matematika", titleUz: "Matematika", description: "Mantiq va hisob", duration: "6 oy", price: 350000, branch: "BOTH" },
  { id: "fallback-8", icon: "⚗️", title: "Fizika", titleUz: "Fizika", description: "Nazariya va masala yechish", duration: "6 oy", price: 350000, branch: "BOTH" },
  { id: "fallback-9", icon: "🧬", title: "Biologiya", titleUz: "Biologiya", description: "DTM tayyorgarlik", duration: "6 oy", price: 350000, branch: "BOTH" },
  { id: "fallback-10", icon: "🧪", title: "Kimyo", titleUz: "Kimyo", description: "Amaliy va nazariy kurs", duration: "6 oy", price: 350000, branch: "BOTH" },
  { id: "fallback-11", icon: "📖", title: "Ona tili va adabiyoti", titleUz: "Ona tili va adabiyoti", description: "Grammatika va ijod", duration: "6 oy", price: 350000, branch: "BOTH" },
];

interface CourseGridProps {
  onEnrollClick: (courseId: string) => void;
}

export function CourseGrid({ onEnrollClick }: CourseGridProps) {
  const [selected, setSelected] = useState<any | null>(null);

  const { data: courses, isLoading } = useQuery({
    queryKey: ["courses-public"],
    queryFn: () => api.get("/api/courses").then((r) => r.data.data),
  });

  const displayCourses = courses && courses.length > 0 ? courses : fallbackCourses;

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
          <p className="mt-4 text-lg text-muted-foreground">Premium yo&apos;nalishlarda professional ta&apos;lim</p>
        </motion.div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 size={36} className="animate-spin text-accent" />
            <p className="text-sm text-muted-foreground">Kurslar yuklanmoqda...</p>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {displayCourses.map((c: any, i: number) => {
              const emoji = c.icon || getEmoji(c.title, c.titleUz);
              return (
                <motion.div
                  key={c.id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05, duration: 0.5 }}
                  onClick={() => setSelected({ ...c, emoji })}
                  className="group cursor-pointer rounded-xl border bg-white p-6 shadow-sm transition-all hover:shadow-md hover:-translate-y-1 flex flex-col justify-between"
                >
                  <div>
                    <div className="mb-4 flex items-center justify-between">
                      <span className="text-3xl">{emoji}</span>
                      {c.titleUz === "Huquq" && <Badge variant="accent">Yangi</Badge>}
                    </div>
                    <h3 className="font-heading text-lg font-bold text-primary">{c.titleUz || c.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground line-clamp-3">{c.description}</p>
                  </div>
                  <div>
                    <div className="mt-4 flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin size={12} /> {formatBranch(c.branch)}
                    </div>
                    <p className="mt-3 font-semibold text-accent">{c.price.toLocaleString("uz-UZ")} UZS/oy</p>
                    <div className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-all group-hover:gap-2.5">
                      Batafsil <ArrowRight size={14} />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-2xl">
              <span>{selected?.emoji}</span> {selected?.titleUz || selected?.title}
            </DialogTitle>
            <DialogDescription className="text-base mt-2">{selected?.description}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <BookOpen size={16} className="text-accent" />
              <strong>Davomiyligi:</strong> {selected?.duration}
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <MapPin size={16} className="text-accent" />
              <strong>Filial:</strong> {formatBranch(selected?.branch)}
            </div>
            <p className="text-2xl font-bold text-accent">{selected?.price?.toLocaleString("uz-UZ")} UZS/oy</p>
            <Button
              variant="accent"
              className="w-full gap-2 mt-4"
              onClick={() => {
                const id = selected.id;
                setSelected(null);
                window.location.href = `https://t.me/todaylcbot`;
              }}
            >
              Ro'yxatdan o'tish <ArrowRight size={16} />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
