"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, Users, BookOpen, LogOut, GraduationCap, Menu, X, Shield } from "lucide-react";

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/enrollments", label: "Arizalar", icon: Users },
  { href: "/admin/courses", label: "Kurslar", icon: BookOpen },
  { href: "/admin/users", label: "Adminlar", icon: Shield },
];

function isAuthenticated() {
  if (typeof window === "undefined") return false;
  const token = sessionStorage.getItem("admin_token");
  return !!token;
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [auth, setAuth] = useState(false);

  useEffect(() => {
    if (pathname === "/admin/login") return;
    const check = isAuthenticated();
    setAuth(check);
    if (!check) router.replace("/admin/login");
  }, [pathname, router]);

  if (pathname === "/admin/login") return <>{children}</>;

  const handleLogout = () => {
    sessionStorage.removeItem("admin_token");
    router.replace("/admin/login");
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <button onClick={() => setSidebarOpen(true)}
        className="fixed left-4 top-4 z-50 flex items-center justify-center rounded-xl bg-navy p-2.5 text-white shadow-lg md:hidden">
        <Menu size={20} />
      </button>

      {sidebarOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 md:hidden" onClick={() => setSidebarOpen(false)}>
          <div className="h-full w-64 bg-navy p-4" onClick={(e) => e.stopPropagation()}>
            <div className="mb-6 flex items-center justify-between">
              <span className="font-heading text-lg font-bold text-white">Today Admin</span>
              <button onClick={() => setSidebarOpen(false)} className="text-white/60"><X size={20} /></button>
            </div>
            <SidebarContent pathname={pathname} handleLogout={handleLogout} />
          </div>
        </div>
      )}

      <aside className="hidden md:flex h-screen w-60 flex-col bg-navy">
        <div className="flex items-center gap-3 px-5 py-6">
          <GraduationCap size={28} className="text-gold shrink-0" />
          <span className="font-heading text-lg font-bold text-white">Today Admin</span>
        </div>
        <SidebarContent pathname={pathname} handleLogout={handleLogout} />
      </aside>

      <main className="flex-1 overflow-auto p-6 md:p-8 pt-20 md:pt-8">
        {children}
      </main>
    </div>
  );
}

function SidebarContent({ pathname, handleLogout }: { pathname: string; handleLogout: () => void }) {
  return (
    <nav className="flex flex-1 flex-col">
      <div className="space-y-1 px-3">
        {navItems.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link key={item.href} href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                active ? "bg-gold text-navy" : "text-white/60 hover:bg-white/10 hover:text-white"
              }`}>
              <item.icon size={18} className="shrink-0" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
      <div className="border-t border-white/10 p-3 mt-auto">
        <button onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white/60 transition-all hover:bg-white/10 hover:text-red-400">
          <LogOut size={18} className="shrink-0" />
          <span>Chiqish</span>
        </button>
      </div>
    </nav>
  );
}
