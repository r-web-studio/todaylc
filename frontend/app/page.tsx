"use client";

import { MessageCircle } from "lucide-react";
import { Navbar } from "@/components/public/navbar";
import { Hero } from "@/components/public/hero";
import { CourseGrid } from "@/components/public/course-grid";
import { ContactSection } from "@/components/public/contact-section";
import { Footer } from "@/components/public/footer";

function openBot(courseId?: string) {
  const url = courseId
    ? `https://t.me/todaylcbot?start=${courseId}`
    : "https://t.me/todaylcbot";
  window.location.href = url;
}

export default function HomePage() {
  return (
    <>
      <Navbar onEnrollClick={() => openBot()} />
      <Hero onEnrollClick={() => openBot()} />
      <CourseGrid onEnrollClick={openBot} />
      <ContactSection />
      <Footer />

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

