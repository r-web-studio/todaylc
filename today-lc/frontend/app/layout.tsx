import type { Metadata } from "next";
import { Toaster } from "sonner";
import { Providers } from "./providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "Today Ta'lim Markazi | Urganch & Shovot",
  description: "7 yildan buyon yoshlarga eng ko'p imkoniyat beruvchi ta'lim markazi — IELTS, CEFR, matematika, fizika va boshqa kurslar.",
  keywords: ["Today Ta'lim Markazi", "Urganch", "Shovot", "IELTS", "CEFR", "ta'lim markazi", "Xorazm", "ingliz tili", "matematika", "fizika"],
  openGraph: {
    title: "Today Ta'lim Markazi",
    description: "IELTS, CEFR, matematika, fizika — Urganch va Shovotda",
    locale: "uz_UZ",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uz" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#0B1D3A" />
      </head>
      <body className="min-h-screen bg-white font-sans text-gray-900 antialiased">
        <Providers>
          {children}
          <Toaster position="top-right" richColors closeButton />
        </Providers>
      </body>
    </html>
  );
}
