"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Shield, ShieldAlert, Trash2 } from "lucide-react";

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

export default function AdminUsers() {
  const router = useRouter();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "ADMIN" });

  useEffect(() => {
    const token = sessionStorage.getItem("admin_token");
    if (!token) { router.replace("/admin/login"); return; }

    fetch("/api/users")
      .then((r) => r.json())
      .then((res) => { if (res.success) setUsers(res.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [router]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        setModalOpen(false);
        setForm({ name: "", email: "", password: "", role: "ADMIN" });
        const refresh = await fetch("/api/users");
        const refreshData = await refresh.json();
        if (refreshData.success) setUsers(refreshData.data);
      }
    } catch {}
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Adminni o'chirishni tasdiqlaysizmi?")) return;
    await fetch(`/api/users/${id}`, { method: "DELETE" });
    const refresh = await fetch("/api/users");
    const refreshData = await refresh.json();
    if (refreshData.success) setUsers(refreshData.data);
  };

  if (loading) return <div className="flex justify-center py-16"><div className="h-8 w-8 animate-spin rounded-full border-4 border-gold border-t-transparent" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-navy">Adminlar</h1>
          <p className="text-sm text-gray-500">{users.length} ta admin</p>
        </div>
        <button onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 rounded-lg bg-gold px-4 py-2 text-sm font-semibold text-navy transition-all hover:bg-gold-light">
          <Plus size={16} /> Yangi admin
        </button>
      </div>

      <div className="space-y-3">
        {users.map((u) => (
          <div key={u.id} className="flex items-center justify-between rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-navy/10">
                {u.role === "SUPERADMIN"
                  ? <ShieldAlert size={20} className="text-gold" />
                  : <Shield size={20} className="text-navy/60" />}
              </div>
              <div>
                <p className="font-semibold text-navy">{u.name}</p>
                <p className="text-sm text-gray-500">{u.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className={`rounded-full px-3 py-1 text-xs font-bold ${
                u.role === "SUPERADMIN" ? "bg-gold/10 text-gold-dark" : "bg-navy/5 text-navy"
              }`}>{u.role}</span>
              <button onClick={() => handleDelete(u.id)}
                className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500">
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setModalOpen(false)}>
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="mb-6 font-heading text-lg font-bold text-navy">Yangi admin</h3>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Ism</label>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-gold focus:ring-2 focus:ring-gold/20" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Email</label>
                <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} type="email"
                  className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-gold focus:ring-2 focus:ring-gold/20" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Parol</label>
                <input value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} type="password"
                  className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-gold focus:ring-2 focus:ring-gold/20" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Rol</label>
                <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}
                  className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-gold focus:ring-2 focus:ring-gold/20">
                  <option value="ADMIN">Admin</option>
                  <option value="SUPERADMIN">Super Admin</option>
                </select>
              </div>
              <button type="submit"
                className="w-full rounded-xl bg-gold py-2.5 text-sm font-semibold text-navy transition-all hover:bg-gold-light">
                Yaratish
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
