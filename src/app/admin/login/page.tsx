"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Eye, EyeOff, LogIn } from "lucide-react";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const router = useRouter();
  const [mode, setMode] = useState<"password" | "email">("password");
  const [email, setEmail] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (mode === "password") {
        const res = await fetch("/api/admin", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password: password.trim() }),
        });
        const data = await res.json();
        if (!res.ok || !data.success) {
          setError(data.error || "Noto'g'ri parol");
          setLoading(false);
          return;
        }
        sessionStorage.setItem("admin_token", password.trim());
        router.push("/admin/dashboard");
      } else {
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });
        const data = await res.json();
        if (!res.ok || !data.success) {
          setError(data.message || "Kirish xatoligi");
          setLoading(false);
          return;
        }
        sessionStorage.setItem("admin_token", data.data.accessToken);
        router.push("/admin/dashboard");
      }
    } catch {
      setError("Serverga ulanishda xatolik");
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-navy p-6">
      <form onSubmit={handleSubmit} className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-xl">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gold/10">
            <Lock size={24} className="text-gold" />
          </div>
          <h1 className="font-heading text-2xl font-bold text-navy" style={{ fontFamily: "Georgia, serif" }}>
            Admin panel
          </h1>
          <p className="mt-1 text-sm text-gray-500">Kirish uchun ma'lumotlarni kiriting</p>
        </div>

        <div className="mb-4 flex rounded-xl border border-gray-200 overflow-hidden">
          <button type="button" onClick={() => setMode("password")}
            className={`flex-1 py-2.5 text-sm font-medium transition-colors ${mode === "password" ? "bg-gold text-navy" : "bg-gray-50 text-gray-500"}`}>
            Parol
          </button>
          <button type="button" onClick={() => setMode("email")}
            className={`flex-1 py-2.5 text-sm font-medium transition-colors ${mode === "email" ? "bg-gold text-navy" : "bg-gray-50 text-gray-500"}`}>
            Email
          </button>
        </div>

        {mode === "email" && (
          <div className="relative mb-5">
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="Email manzil" autoFocus
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition-all focus:border-gold focus:ring-2 focus:ring-gold/20" />
          </div>
        )}

        <div className="relative mb-5">
          <input type={show ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)}
            placeholder={mode === "password" ? "Admin paroli" : "Parol"} autoFocus={mode === "password"}
            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 pr-11 text-sm outline-none transition-all focus:border-gold focus:ring-2 focus:ring-gold/20" />
          <button type="button" onClick={() => setShow(!show)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600" tabIndex={-1}>
            {show ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        {error && <p className="mb-4 text-center text-sm text-red-500">{error}</p>}

        <button type="submit" disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-gold to-gold-light px-6 py-3 text-sm font-semibold text-navy shadow-lg shadow-gold/20 transition-all hover:shadow-xl hover:shadow-gold/30 disabled:opacity-50">
          {loading ? (
            <span className="h-5 w-5 animate-spin rounded-full border-2 border-navy border-t-transparent" />
          ) : (
            <><LogIn size={16} /> Kirish</>
          )}
        </button>
      </form>
    </div>
  );
}
