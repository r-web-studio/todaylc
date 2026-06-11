"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { courses, type Course } from "@/data/courses";
import { Badge } from "@/components/ui/badge";
import { CourseModal } from "@/components/ui/course-modal";

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.05 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

export function Courses() {
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  return (
    <section id="courses" className="relative bg-soft-white py-24 md:py-32">
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
            Bizning kurslar
          </h2>
          <p className="mt-4 text-lg text-gray-500">
            Eng so'nggi metodikalar bo'yicha professional ta'lim
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          {courses.map((course) => (
            <motion.div
              key={course.id}
              variants={cardVariants}
              onClick={() => setSelectedCourse(course)}
              className="group card-hover relative cursor-pointer rounded-2xl border border-gray-100 bg-white p-6 shadow-xs transition-all hover:shadow-lg active:scale-[0.98]"
            >
              <div className="mb-4 flex items-center justify-between">
                <span className="text-3xl">{course.icon}</span>
                {course.isNew && <Badge variant="new">Yangi!</Badge>}
              </div>
              <h3
                className="font-heading text-xl font-bold text-navy"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {course.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-500">{course.description}</p>
              <div className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-gold transition-all group-hover:gap-2.5">
                Batafsil <ArrowRight size={14} />
              </div>

              <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-transparent transition-all duration-300 group-hover:ring-gold/30" />
            </motion.div>
          ))}
        </motion.div>
      </div>

      <CourseModal course={selectedCourse} onClose={() => setSelectedCourse(null)} />
    </section>
  );
}
