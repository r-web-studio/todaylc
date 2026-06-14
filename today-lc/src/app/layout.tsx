import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import { Providers } from "@/components/providers";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-heading",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Today Ta'lim Markazi | Urganch",
  description:
    "7 yildan buyon yoshlarga eng ko'p imkoniyat beruvchi ta'lim markazi — Urganchda. IELTS, CEFR, matematika, fizika va boshqa kurslar. Kursga yoziling va kelajagingizni bugun boshlang!",
  keywords: [
    "Today Ta'lim Markazi",
    "Urganch",
    "IELTS",
    "CEFR",
    "ta'lim markazi",
    "Xorazm",
    "ingliz tili",
    "matematika",
    "fizika",
  ],
  other: {
    "theme-color": "#0B1F3A",
  },
  openGraph: {
    title: "Today Ta'lim Markazi",
    description: "7 yildan buyon yoshlarga eng ko'p imkoniyat beruvchi ta'lim markazi — Urganchda",
    locale: "uz_UZ",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="uz"
      className={`${playfair.variable} ${inter.variable}`}
    >
      <body className="min-h-screen bg-white font-body text-gray-900 antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
