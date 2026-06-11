"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Loader2, Check, ArrowLeft, ArrowRight, Send, User, Phone, Mail, MessageSquare, BookOpen, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import api from "@/lib/api";

const courses = [
  { id: "1", icon: "🌍", title: "IELTS" },
  { id: "2", icon: "📋", title: "CEFR" },
  { id: "3", icon: "🇬🇧", title: "Ingliz tili" },
  { id: "4", icon: "🇷🇺", title: "Rus tili" },
  { id: "5", icon: "📖", title: "Tarix" },
  { id: "6", icon: "⚖️", title: "Huquq" },
  { id: "7", icon: "➕", title: "Matematika" },
  { id: "8", icon: "⚗️", title: "Fizika" },
  { id: "9", icon: "🧬", title: "Biologiya" },
  { id: "10", icon: "🧪", title: "Kimyo" },
  { id: "11", icon: "📖", title: "Ona tili va adabiyoti" },
];

const step1Schema = z.object({
  studentName: z.string().min(2, "Ismingiz kamida 2 harf bo'lishi kerak"),
  studentPhone: z.string().min(7, "Telefon raqamni to'liq kiriting"),
  studentEmail: z.string().email("Email noto'g'ri").optional().or(z.literal("")),
});

const step2Schema = z.object({
  courseId: z.string().min(1, "Kursni tanlang"),
  branch: z.enum(["URGANCH", "SHOVOT"]),
});

type Step1Data = z.infer<typeof step1Schema>;
type Step2Data = z.infer<typeof step2Schema>;

interface EnrollModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EnrollModal({ open, onOpenChange }: EnrollModalProps) {
  const [step, setStep] = useState(1);
  const [step1Data, setStep1Data] = useState<Step1Data | null>(null);
  const [step2Data, setStep2Data] = useState<Step2Data | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const step1Form = useForm<Step1Data>({
    resolver: zodResolver(step1Schema),
    defaultValues: { studentName: "", studentPhone: "", studentEmail: "" },
  });

  const step2Form = useForm<Step2Data>({
    resolver: zodResolver(step2Schema),
    defaultValues: { courseId: "", branch: "URGANCH" },
  });

  const handleStep1Submit = (data: Step1Data) => {
    setStep1Data(data);
    setStep(2);
  };

  const handleStep2Submit = async (data: Step2Data) => {
    setStep2Data(data);
    if (!step1Data) return;
    setSubmitting(true);
    try {
      await api.post("/api/enrollments", { ...step1Data, ...data, message: "" });
      setStep(3);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Xatolik yuz berdi");
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setStep(1);
    setStep1Data(null);
    setStep2Data(null);
    step1Form.reset();
    step2Form.reset();
  };

  const selectedCourse = courses.find((c) => c.id === step2Data?.courseId || step2Form.watch("courseId"));

  return (
    <Dialog open={open} onOpenChange={(v) => { onOpenChange(v); if (!v) handleReset(); }}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {step === 1 && <><User size={20} className="text-accent" /> Shaxsiy ma'lumotlar</>}
            {step === 2 && <><BookOpen size={20} className="text-accent" /> Kursni tanlash</>}
            {step === 3 && <><Check size={20} className="text-accent" /> Tasdiqlash</>}
          </DialogTitle>
        </DialogHeader>

        {/* Progress bar */}
        <div className="flex gap-1.5">
          {[1, 2, 3].map((s) => (
            <div key={s} className={`h-1.5 flex-1 rounded-full transition-colors ${s <= step ? "bg-accent" : "bg-gray-200"}`} />
          ))}
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.form key="step1" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} onSubmit={step1Form.handleSubmit(handleStep1Submit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="studentName">Ismingiz *</Label>
                <div className="relative">
                  <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input id="studentName" className="pl-9" placeholder="Ali Karimov" {...step1Form.register("studentName")} />
                </div>
                {step1Form.formState.errors.studentName && <p className="text-xs text-destructive">{step1Form.formState.errors.studentName.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="studentPhone">Telefon *</Label>
                <div className="relative">
                  <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input id="studentPhone" className="pl-9" placeholder="+998901234567" {...step1Form.register("studentPhone")} />
                </div>
                {step1Form.formState.errors.studentPhone && <p className="text-xs text-destructive">{step1Form.formState.errors.studentPhone.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="studentEmail">Email (ixtiyoriy)</Label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input id="studentEmail" className="pl-9" placeholder="ali@example.com" {...step1Form.register("studentEmail")} />
                </div>
              </div>
              <Button type="submit" variant="accent" className="w-full gap-2">
                Davom etish <ArrowRight size={16} />
              </Button>
            </motion.form>
          )}

          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-4">
              <div className="space-y-2">
                <Label>Kursni tanlang *</Label>
                <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                  {courses.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => step2Form.setValue("courseId", c.id)}
                      className={`flex items-center gap-2 rounded-lg border p-3 text-left text-sm transition-all ${step2Form.watch("courseId") === c.id ? "border-accent bg-accent/10 ring-1 ring-accent" : "border-input hover:border-accent/50"}`}
                    >
                      <span className="text-xl">{c.icon}</span>
                      <span className="font-medium">{c.title}</span>
                    </button>
                  ))}
                </div>
                {step2Form.formState.errors.courseId && <p className="text-xs text-destructive">{step2Form.formState.errors.courseId.message}</p>}
              </div>
              <div className="space-y-2">
                <Label>Filial *</Label>
                <div className="grid grid-cols-2 gap-2">
                  {(["URGANCH", "SHOVOT"] as const).map((b) => (
                    <button
                      key={b}
                      type="button"
                      onClick={() => step2Form.setValue("branch", b)}
                      className={`flex items-center justify-center gap-2 rounded-lg border p-3 text-sm transition-all ${step2Form.watch("branch") === b ? "border-accent bg-accent/10 ring-1 ring-accent" : "border-input hover:border-accent/50"}`}
                    >
                      <MapPin size={16} /> {b === "URGANCH" ? "Urganch" : "Shovot"}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1 gap-2" onClick={() => setStep(1)}>
                  <ArrowLeft size={16} /> Orqaga
                </Button>
                <Button variant="accent" className="flex-1 gap-2" onClick={step2Form.handleSubmit(handleStep2Submit)}>
                  {submitting ? <Loader2 size={16} className="animate-spin" /> : <><Send size={16} /> Yuborish</>}
                </Button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="space-y-6 py-4 text-center">
              <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-green-100">
                <Check size={32} className="text-green-600" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-semibold">Arizangiz qabul qilindi!</h3>
                <p className="text-sm text-muted-foreground">Tez orada siz bilan bog'lanamiz.</p>
              </div>
              <div className="rounded-lg bg-muted/50 p-4 text-left text-sm space-y-2">
                <div className="flex items-center gap-2">
                  <User size={14} className="text-muted-foreground shrink-0" />
                  <span>{step1Data?.studentName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone size={14} className="text-muted-foreground shrink-0" />
                  <span>{step1Data?.studentPhone}</span>
                </div>
                {step1Data?.studentEmail && (
                  <div className="flex items-center gap-2">
                    <Mail size={14} className="text-muted-foreground shrink-0" />
                    <span>{step1Data.studentEmail}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <BookOpen size={14} className="text-muted-foreground shrink-0" />
                  <span>{selectedCourse?.icon} {selectedCourse?.title}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={14} className="text-muted-foreground shrink-0" />
                  <span>{step2Data?.branch === "URGANCH" ? "Urganch" : "Shovot"}</span>
                </div>
              </div>
              <Button variant="accent" className="w-full gap-2" onClick={() => { onOpenChange(false); handleReset(); }}>
                <Check size={16} /> Tushunarli
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
