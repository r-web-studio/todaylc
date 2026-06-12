"use client";

import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Loader2, Check, ArrowLeft, ArrowRight, Send, User, Phone, Mail, BookOpen, MapPin, MessageSquare, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { enrollmentSchema } from "@/lib/validators";
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

interface EnrollModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  preselectedCourseId?: string;
}

export function EnrollModal({ open, onOpenChange, preselectedCourseId }: EnrollModalProps) {
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const confettiCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const confettiRef = useRef<any>(null);

  // Fetch active courses from the API
  const { data: courses } = useQuery({
    queryKey: ["courses-modal"],
    queryFn: () => api.get("/api/courses").then((r) => r.data.data),
    enabled: open,
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    trigger,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(enrollmentSchema),
    defaultValues: {
      studentName: "",
      studentPhone: "",
      studentEmail: "",
      courseId: "",
      branch: "URGANCH" as "URGANCH" | "SHOVOT",
      message: "",
    },
  });

  const values = watch();

  // Handle pre-selection of courses
  useEffect(() => {
    if (open && preselectedCourseId) {
      setValue("courseId", preselectedCourseId);
    }
  }, [open, preselectedCourseId, setValue]);

  // Handle Confetti rendering when successfully completed
  useEffect(() => {
    if (step === 4) {
      const initConfetti = async () => {
        try {
          const ConfettiGenerator = (await import("confetti-js")).default;
          if (confettiCanvasRef.current) {
            const settings = {
              target: confettiCanvasRef.current,
              max: 80,
              size: 1.2,
              animate: true,
              props: ["circle", "square", "triangle", "line"],
              colors: [[11, 29, 58], [245, 166, 35], [34, 197, 94], [239, 68, 68]],
              clock: 25,
            };
            confettiRef.current = new ConfettiGenerator(settings);
            confettiRef.current.render();
          }
        } catch (err) {
          console.error("Failed to load confetti", err);
        }
      };
      initConfetti();
    } else {
      if (confettiRef.current) {
        confettiRef.current.clear();
        confettiRef.current = null;
      }
    }

    return () => {
      if (confettiRef.current) {
        confettiRef.current.clear();
        confettiRef.current = null;
      }
    };
  }, [step]);

  const handleNextStep = async () => {
    if (step === 1) {
      const valid = await trigger(["studentName", "studentPhone", "studentEmail"]);
      if (valid) setStep(2);
    } else if (step === 2) {
      const valid = await trigger(["courseId", "branch"]);
      if (valid) setStep(3);
    }
  };

  const handlePrevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFormSubmit = async () => {
    setSubmitting(true);
    try {
      // We must support file upload for student photo if selected
      const formData = new FormData();
      formData.append("studentName", values.studentName);
      formData.append("studentPhone", values.studentPhone);
      if (values.studentEmail) formData.append("studentEmail", values.studentEmail);
      formData.append("courseId", values.courseId);
      formData.append("branch", values.branch);
      if (values.message) formData.append("message", values.message);
      if (photoFile) {
        formData.append("photo", photoFile);
      }

      await api.post("/api/enrollments", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Muvaffaqiyatli ro'yxatdan o'tdingiz!", {
        description: "Tez orada menejerlarimiz siz bilan bog'lanishadi.",
      });

      setStep(4); // Show success screen
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || "Hujjat yuborishda xatolik yuz berdi. Iltimos qaytadan urinib ko'ring.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setStep(1);
    setPhotoFile(null);
    setPhotoPreview(null);
    reset();
  };

  const selectedCourse = courses?.find((c: any) => c.id === values.courseId);

  return (
    <Dialog open={open} onOpenChange={(v) => { onOpenChange(v); if (!v) handleReset(); }}>
      <DialogContent className="sm:max-w-[500px] overflow-hidden relative">
        {step === 4 && (
          <canvas
            ref={confettiCanvasRef}
            className="absolute inset-0 pointer-events-none w-full h-full z-40"
          />
        )}

        <DialogHeader className="z-10">
          <DialogTitle className="flex items-center gap-2">
            {step === 1 && <><User size={20} className="text-accent" /> Shaxsiy ma'lumotlar (1/3)</>}
            {step === 2 && <><BookOpen size={20} className="text-accent" /> Kursni tanlash (2/3)</>}
            {step === 3 && <><MessageSquare size={20} className="text-accent" /> Yakuniy bosqich (3/3)</>}
            {step === 4 && <><Check size={20} className="text-green-600" /> Ariza qabul qilindi!</>}
          </DialogTitle>
        </DialogHeader>

        {/* Progress bar */}
        {step < 4 && (
          <div className="flex gap-1.5 my-2 z-10">
            {[1, 2, 3].map((s) => (
              <div key={s} className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${s <= step ? "bg-accent" : "bg-gray-200"}`} />
            ))}
          </div>
        )}

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4 z-10 mt-2"
            >
              <div className="space-y-2">
                <Label htmlFor="studentName">F.I.SH. (Ism va Familiyangiz) *</Label>
                <div className="relative">
                  <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input id="studentName" className="pl-9" placeholder="Ali Karimov" {...register("studentName")} />
                </div>
                {errors.studentName && <p className="text-xs text-destructive">{errors.studentName.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="studentPhone">Telefon raqamingiz *</Label>
                <div className="relative">
                  <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input id="studentPhone" className="pl-9" placeholder="+998901234567" {...register("studentPhone")} />
                </div>
                {errors.studentPhone && <p className="text-xs text-destructive">{errors.studentPhone.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="studentEmail">E-mail manzilingiz (ixtiyoriy)</Label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input id="studentEmail" className="pl-9" placeholder="ali@gmail.com" {...register("studentEmail")} />
                </div>
                {errors.studentEmail && <p className="text-xs text-destructive">{errors.studentEmail.message}</p>}
              </div>

              <Button type="button" variant="accent" className="w-full gap-2 mt-4" onClick={handleNextStep}>
                Davom etish <ArrowRight size={16} />
              </Button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-4 z-10 mt-2"
            >
              <div className="space-y-2">
                <Label>Kursni tanlang *</Label>
                {courses && courses.length > 0 ? (
                  <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                    {courses.map((c: any) => {
                      const emoji = getEmoji(c.title, c.titleUz);
                      return (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() => setValue("courseId", c.id)}
                          className={`flex items-center gap-2 rounded-lg border p-3 text-left text-sm transition-all ${values.courseId === c.id ? "border-accent bg-accent/10 ring-1 ring-accent" : "border-input hover:border-accent/50"}`}
                        >
                          <span className="text-xl">{emoji}</span>
                          <span className="font-semibold text-primary">{c.titleUz || c.title}</span>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="py-4 text-center text-muted-foreground text-sm">
                    Kutib turing, kurslar yuklanmoqda...
                  </div>
                )}
                {errors.courseId && <p className="text-xs text-destructive">{errors.courseId.message}</p>}
              </div>

              <div className="space-y-2">
                <Label>Qaysi filialda o'qimoqchisiz? *</Label>
                <div className="grid grid-cols-2 gap-2">
                  {(["URGANCH", "SHOVOT"] as const).map((b) => (
                    <button
                      key={b}
                      type="button"
                      onClick={() => setValue("branch", b)}
                      className={`flex items-center justify-center gap-2 rounded-lg border p-3 text-sm font-medium transition-all ${values.branch === b ? "border-accent bg-accent/10 ring-1 ring-accent" : "border-input hover:border-accent/50"}`}
                    >
                      <MapPin size={16} className="text-accent" /> {b === "URGANCH" ? "Urganch" : "Shovot"}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                <Button type="button" variant="outline" className="flex-1 gap-2" onClick={handlePrevStep}>
                  <ArrowLeft size={16} /> Orqaga
                </Button>
                <Button type="button" variant="accent" className="flex-1 gap-2" onClick={handleNextStep}>
                  Davom etish <ArrowRight size={16} />
                </Button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="space-y-4 z-10 mt-2"
            >
              <div className="space-y-2">
                <Label htmlFor="message">Qo'shimcha istaklar (ixtiyoriy)</Label>
                <textarea
                  id="message"
                  className="flex h-20 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  placeholder="Masalan: Kechki guruhda o'qimoqchiman..."
                  {...register("message")}
                />
              </div>

              <div className="space-y-2">
                <Label>Rasm yuklash (ixtiyoriy)</Label>
                <div className="flex items-center gap-3">
                  <Label
                    htmlFor="photoUpload"
                    className="flex items-center gap-2 border border-dashed border-input rounded-lg px-4 py-3 cursor-pointer hover:bg-muted text-sm text-muted-foreground transition-all flex-1 justify-center"
                  >
                    <Upload size={16} /> Rasm tanlash
                  </Label>
                  <input
                    id="photoUpload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handlePhotoChange}
                  />
                  {photoPreview && (
                    <img
                      src={photoPreview}
                      alt="Student Preview"
                      className="w-12 h-12 rounded-lg object-cover border"
                    />
                  )}
                </div>
              </div>

              <div className="rounded-lg bg-muted p-4 space-y-2.5 text-sm">
                <h4 className="font-bold text-primary border-b pb-1">Ariza ma'lumotlari:</h4>
                <div className="grid grid-cols-3 gap-1">
                  <span className="text-muted-foreground">Ism:</span>
                  <span className="col-span-2 font-medium">{values.studentName}</span>

                  <span className="text-muted-foreground">Telefon:</span>
                  <span className="col-span-2 font-medium">{values.studentPhone}</span>

                  {values.studentEmail && (
                    <>
                      <span className="text-muted-foreground">Email:</span>
                      <span className="col-span-2 font-medium">{values.studentEmail}</span>
                    </>
                  )}

                  <span className="text-muted-foreground">Kurs:</span>
                  <span className="col-span-2 font-semibold text-accent">
                    {selectedCourse ? `${getEmoji(selectedCourse.title, selectedCourse.titleUz)} ${selectedCourse.titleUz || selectedCourse.title}` : "Tanlanmagan"}
                  </span>

                  <span className="text-muted-foreground">Filial:</span>
                  <span className="col-span-2 font-medium">{values.branch === "URGANCH" ? "Urganch" : "Shovot"}</span>
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                <Button type="button" variant="outline" className="flex-1 gap-2" onClick={handlePrevStep} disabled={submitting}>
                  <ArrowLeft size={16} /> Orqaga
                </Button>
                <Button type="button" variant="accent" className="flex-1 gap-2" onClick={handleFormSubmit} disabled={submitting}>
                  {submitting ? <Loader2 size={16} className="animate-spin" /> : <><Send size={16} /> Tasdiqlash</>}
                </Button>
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-6 text-center space-y-6 z-50 relative"
            >
              <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-green-100">
                <Check size={32} className="text-green-600 animate-bounce" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-primary">Arizangiz muvaffaqiyatli qabul qilindi!</h3>
                <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                  Tez orada operatorlarimiz siz bilan bog'lanib guruhlar va dars jadvallarini ma'lum qilishadi.
                </p>
              </div>

              <div className="rounded-lg bg-primary/5 p-4 text-left text-sm max-w-sm mx-auto space-y-2 border">
                <div className="flex items-center gap-2">
                  <User size={14} className="text-accent shrink-0" />
                  <span className="font-semibold text-primary">{values.studentName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone size={14} className="text-accent shrink-0" />
                  <span className="text-muted-foreground">{values.studentPhone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen size={14} className="text-accent shrink-0" />
                  <span className="font-medium text-primary">
                    {selectedCourse?.titleUz || selectedCourse?.title}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={14} className="text-accent shrink-0" />
                  <span className="text-muted-foreground">
                    {values.branch === "URGANCH" ? "Urganch filiali" : "Shovot filiali"}
                  </span>
                </div>
              </div>

              <Button variant="accent" className="w-full max-w-xs gap-2" onClick={() => { onOpenChange(false); handleReset(); }}>
                <Check size={16} /> Oynani yopish
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
