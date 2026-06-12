"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Loader2, Trash2, Pencil } from "lucide-react";

interface Course {
  id: string;
  title: string;
  titleUz: string;
  description: string;
  duration: string;
  price: number;
  branch: string;
  isActive: boolean;
}

export default function AdminCourses() {
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: "", titleUz: "", description: "", duration: "", price: "", branch: "BOTH",
  });

  useEffect(() => {
    const token = sessionStorage.getItem("admin_token");
    if (!token) { router.replace("/admin/login"); return; }

    fetch("/api/courses")
      .then((r) => r.json())
      .then((res) => { if (res.success) setCourses(res.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [router]);

  const openCreate = () => {
    setEditing(null);
    setForm({ title: "", titleUz: "", description: "", duration: "", price: "", branch: "BOTH" });
    setModalOpen(true);
  };

  const openEdit = (c: Course) => {
    setEditing(c.id);
    setForm({ title: c.title, titleUz: c.titleUz, description: c.description, duration: c.duration, price: String(c.price), branch: c.branch });
    setModalOpen(true);
  };

  const authHeaders = () => {
    const t = typeof window !== "undefined" ? sessionStorage.getItem("admin_token") : null;
    return t ? { "Content-Type": "application/json", Authorization: `Bearer ${t}` } as Record<string, string>
             : { "Content-Type": "application/json" };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = editing ? "PUT" : "POST";
    const url = editing ? `/api/courses/${editing}` : "/api/courses";
    try {
      const res = await fetch(url, {
        method,
        headers: authHeaders(),
        body: JSON.stringify({ ...form, price: Number(form.price) }),
      });
      const data = await res.json();
      if (data.success) {
        setModalOpen(false);
        const refresh = await fetch("/api/courses");
        const refreshData = await refresh.json();
        if (refreshData.success) setCourses(refreshData.data);
      }
    } catch {}
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Kursni o'chirishni tasdiqlaysizmi?")) return;
    await fetch(`/api/courses/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${sessionStorage.getItem("admin_token")}` } });
    const refresh = await fetch("/api/courses");
    const refreshData = await refresh.json();
    if (refreshData.success) setCourses(refreshData.data);
  };

  if (loading) return <div className="flex justify-center py-16"><div className="h-8 w-8 animate-spin rounded-full border-4 border-gold border-t-transparent" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-navy">Kurslar</h1>
          <p className="text-sm text-gray-500">{courses.length} ta kurs</p>
        </div>
        <button onClick={openCreate}
          className="flex items-center gap-2 rounded-lg bg-gold px-4 py-2 text-sm font-semibold text-navy transition-all hover:bg-gold-light">
          <Plus size={16} /> Yangi kurs
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {courses.map((c) => (
          <div key={c.id} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md">
            <div className="mb-3 flex items-start justify-between">
              <h3 className="font-heading text-lg font-bold text-navy">{c.titleUz}</h3>
              <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                c.isActive ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
              }`}>{c.isActive ? "Active" : "Inactive"}</span>
            </div>
            <p className="mb-4 text-sm text-gray-500">{c.description.slice(0, 80)}...</p>
            <div className="mb-4 flex items-center gap-4 text-sm text-gray-500">
              <span>💰 {c.price.toLocaleString()} UZS</span>
              <span>📅 {c.duration}</span>
            </div>
            <div className="flex gap-2">
              <button onClick={() => openEdit(c)}
                className="flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 transition-colors hover:border-gold hover:text-gold">
                <Pencil size={12} /> Tahrirlash
              </button>
              <button onClick={() => handleDelete(c.id)}
                className="flex items-center gap-1 rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-500 transition-colors hover:bg-red-50">
                <Trash2 size={12} /> O'chirish
              </button>
            </div>
          </div>
        ))}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setModalOpen(false)}>
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="mb-6 font-heading text-lg font-bold text-navy">{editing ? "Kursni tahrirlash" : "Yangi kurs"}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Title (EN)</label>
                  <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-gold focus:ring-2 focus:ring-gold/20" />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Title (UZ)</label>
                  <input value={form.titleUz} onChange={(e) => setForm({ ...form, titleUz: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-gold focus:ring-2 focus:ring-gold/20" />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Tavsif</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 h-20" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Davomiyligi</label>
                  <input value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-gold focus:ring-2 focus:ring-gold/20" />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Narxi (UZS)</label>
                  <input value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} type="number"
                    className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-gold focus:ring-2 focus:ring-gold/20" />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Filial</label>
                <select value={form.branch} onChange={(e) => setForm({ ...form, branch: e.target.value })}
                  className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-gold focus:ring-2 focus:ring-gold/20">
                  <option value="BOTH">Ikkala filial</option>
                  <option value="URGANCH">Urganch</option>
                  <option value="SHOVOT">Shovot</option>
                </select>
              </div>
              <button type="submit"
                className="w-full rounded-xl bg-gold py-2.5 text-sm font-semibold text-navy transition-all hover:bg-gold-light">
                {editing ? "Yangilash" : "Yaratish"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
