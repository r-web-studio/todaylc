"use client";

import { GraduationCap, Send, Heart } from "lucide-react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-primary text-white/70">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="flex items-center gap-2">
            <GraduationCap size={24} className="text-accent" />
            <span className="font-heading text-lg font-bold text-white">Today Ta'lim Markazi</span>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <a href="https://t.me/today_LC" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 transition-colors hover:text-accent">
              <Send size={14} /> Telegram
            </a>
            <Link href="/admin" className="text-white/30 transition-colors hover:text-white/60">
              Admin
            </Link>
          </div>
        </div>
        <div className="mt-8 border-t border-white/10 pt-8 text-center text-sm text-white/40">
          <p className="flex items-center justify-center gap-1">
            Made with <Heart size={12} className="text-red-400" /> in Urganch &copy; {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </footer>
  );
}
