import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const courseSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  titleUz: z.string().min(2, "Uzbek title must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  duration: z.string().min(1, "Duration is required"),
  price: z.coerce.number().int().positive("Price must be a positive number"),
  branch: z.enum(["URGANCH", "SHOVOT", "BOTH"]),
  isActive: z.boolean().optional().default(true),
});

export const enrollmentSchema = z.object({
  studentName: z.string().min(2, "Ismingiz kamida 2 harf bo'lishi kerak"),
  studentPhone: z.string().min(7, "Telefon raqamni to'liq kiriting"),
  studentEmail: z.string().email("Email noto'g'ri").optional().or(z.literal("")),
  courseId: z.string().min(1, "Kursni tanlang"),
  branch: z.enum(["URGANCH", "SHOVOT"]),
  message: z.string().optional(),
});

export const userSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.enum(["ADMIN", "SUPERADMIN"]),
});
