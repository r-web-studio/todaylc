"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { LayoutDashboard, Users, BookOpen, Shield, LogOut, ChevronLeft, ChevronRight, GraduationCap, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/lib/store";

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/enrollments", label: "Enrollments", icon: Users },
  { href: "/admin/courses", label: "Courses", icon: BookOpen },
  { href: "/admin/users", label: "Admins", icon: Shield, superadmin: true },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const filteredItems = navItems.filter((item) => !item.superadmin || user?.role === "SUPERADMIN");

  const nav = (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-3 px-4 py-6">
        <GraduationCap size={28} className="text-accent shrink-0" />
        {!collapsed && <span className="font-heading text-lg font-bold text-white">Today Admin</span>}
      </div>

      <nav className="flex-1 space-y-1 px-3">
        {filteredItems.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                active ? "bg-accent text-accent-foreground" : "text-white/60 hover:bg-white/10 hover:text-white"
              )}
            >
              <item.icon size={18} className="shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/10 p-3">
        <button
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white/60 transition-all hover:bg-white/10 hover:text-red-400"
        >
          <LogOut size={18} className="shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>

      <button
        onClick={() => setCollapsed(!collapsed)}
        className="hidden border-t border-white/10 p-3 md:flex items-center justify-center text-white/40 hover:text-white"
      >
        {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
      </button>
    </div>
  );

  return (
    <>
      {/* Mobile toggle */}
      <button onClick={() => setMobileOpen(true)} className="fixed left-4 top-4 z-50 md:hidden">
        <Menu size={24} className="text-primary" />
      </button>

      {/* Mobile sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 md:hidden"
            onClick={() => setMobileOpen(false)}
          >
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="h-full w-64 bg-primary p-4"
              onClick={(e) => e.stopPropagation()}
            >
              <button onClick={() => setMobileOpen(false)} className="mb-4 text-white/60"><X size={24} /></button>
              {nav}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop sidebar */}
      <aside className={cn("hidden md:flex h-screen flex-col bg-primary transition-all duration-300", collapsed ? "w-16" : "w-60")}>
        {nav}
      </aside>
    </>
  );
}
