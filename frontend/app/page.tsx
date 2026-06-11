"use client";

import { useState } from "react";
import { MessageCircle } from "lucide-react";
import { Navbar } from "@/components/public/navbar";
import { Hero } from "@/components/public/hero";
import { CourseGrid } from "@/components/public/course-grid";
import { ContactSection } from "@/components/public/contact-section";
import { Footer } from "@/components/public/footer";
import { EnrollModal } from "@/components/public/enroll-modal";

export default function HomePage() {
  const [isEnrollOpen, setIsEnrollOpen] = useState(false);
  const [preselectedCourseId, setPreselectedCourseId] = useState<string | undefined>(undefined);

  const handleEnrollClick = (courseId?: string) => {
    setPreselectedCourseId(courseId);
    setIsEnrollOpen(true);
  };

  return (
    <>
      <Navbar onEnrollClick={() => handleEnrollClick()} />
      <Hero onEnrollClick={() => handleEnrollClick()} />
      <CourseGrid onEnrollClick={handleEnrollClick} />
      <ContactSection />
      <Footer />

      <EnrollModal
        open={isEnrollOpen}
        onOpenChange={setIsEnrollOpen}
        preselectedCourseId={preselectedCourseId}
      />

      {/* Floating Telegram button */}
      <a
        href="https://t.me/today_LC"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-accent text-white shadow-lg transition-all hover:bg-accent/90 hover:scale-110"
      >
        <MessageCircle size={28} />
      </a>
    </>
  );
}

