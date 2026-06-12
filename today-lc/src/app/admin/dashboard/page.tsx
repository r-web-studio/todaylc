"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, Users, Phone, BookOpen, MapPin, Calendar, Search, Download } from "lucide-react";

interface Enrollment {
  id: number;
  name: string;
  phone: string;
  course: string;
  branch: string;
  created_at: string;
}

export default function AdminDashboard() {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const router = useRouter();

  useEffect(() => {
    const token = sessionStorage.getItem("admin_token");
    if (!token) {
      router.replace("/admin/login");
      return;
    }

    fetch("/api/admin", {
      headers: { Authorization: `Bearer ${token}` },
    }).then((res) => {
      if (res.status === 401) {
        sessionStorage.removeItem("admin_token");
        router.replace("/admin/login");
        return;
      }
      return res.json();
    }).then((data) => {
      if (!data) return;
      if (!data.success) {
        setError(data.error || "Ma'lumotlarni yuklashda xatolik");
        setLoading(false);
        return;
      }
      setEnrollments(data.data || []);
      setLoading(false);
    }).catch(() => {
      setError("Ma'lumotlarni yuklashda xatolik");
      setLoading(false);
    });
  }, [router]);

  const handleLogout = () => {
    sessionStorage.removeItem("admin_token");
    router.replace("/admin/login");
  };

  const filtered = enrollments.filter(
    (e) =>
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.phone.includes(search) ||
      e.course.toLowerCase().includes(search.toLowerCase())
  );

  const exportCSV = () => {
    const headers = ["ID", "Ism", "Telefon", "Kurs", "Filial", "Sana"];
    const rows = filtered.map((e) => [
      e.id,
      e.name,
      e.phone,
      e.course,
      e.branch,
      new Date(e.created_at).toLocaleDateString("uz-UZ"),
    ]);
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `enrollments-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-gold border-t-transparent" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-10 border-b border-gray-200 bg-white shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div>
            <h1 className="font-heading text-xl font-bold text-navy" style={{ fontFamily: "Georgia, serif" }}>
              Admin panel
            </h1>
            <p className="text-xs text-gray-500">
              {enrollments.length} ta ariza
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={exportCSV}
              className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium text-gray-600 transition-colors hover:border-gold hover:text-gold"
            >
              <Download size={14} />
              CSV
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-2 text-xs font-medium text-red-500 transition-colors hover:border-red-300 hover:bg-red-50"
            >
              <LogOut size={14} />
              Chiqish
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Ism, telefon yoki kurs bo'yicha qidirish..."
              className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none transition-all focus:border-gold focus:ring-2 focus:ring-gold/20"
            />
          </div>

          <div className="flex gap-2 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <Users size={14} /> {filtered.length} ta
            </span>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-gray-200 bg-white p-16 text-center">
            <Users size={48} className="mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-semibold text-gray-600">Arizalar mavjud emas</h3>
            <p className="mt-1 text-sm text-gray-400">Hali hech kim kursga yozilmagan</p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/80">
                    <th className="px-5 py-3.5 font-semibold text-gray-600">ID</th>
                    <th className="px-5 py-3.5 font-semibold text-gray-600">
                      <div className="flex items-center gap-1.5">
                        <Users size={14} /> Ism
                      </div>
                    </th>
                    <th className="px-5 py-3.5 font-semibold text-gray-600">
                      <div className="flex items-center gap-1.5">
                        <Phone size={14} /> Telefon
                      </div>
                    </th>
                    <th className="px-5 py-3.5 font-semibold text-gray-600">
                      <div className="flex items-center gap-1.5">
                        <BookOpen size={14} /> Kurs
                      </div>
                    </th>
                    <th className="px-5 py-3.5 font-semibold text-gray-600">
                      <div className="flex items-center gap-1.5">
                        <MapPin size={14} /> Filial
                      </div>
                    </th>
                    <th className="px-5 py-3.5 font-semibold text-gray-600">
                      <div className="flex items-center gap-1.5">
                        <Calendar size={14} /> Sana
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((e) => (
                    <tr
                      key={e.id}
                      className="border-b border-gray-50 transition-colors hover:bg-gold/5 last:border-0"
                    >
                      <td className="px-5 py-4 text-xs text-gray-400">#{e.id}</td>
                      <td className="px-5 py-4 font-medium text-navy">{e.name}</td>
                      <td className="px-5 py-4">
                        <a
                          href={`tel:${e.phone}`}
                          className="text-gold transition-colors hover:text-gold-dark"
                        >
                          {e.phone}
                        </a>
                      </td>
                      <td className="px-5 py-4">
                        <span className="inline-block rounded-full bg-gold/10 px-3 py-1 text-xs font-medium text-gold-dark">
                          {e.course}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-sm text-gray-600">{e.branch}</td>
                      <td className="px-5 py-4 text-sm text-gray-400">
                        {new Date(e.created_at).toLocaleDateString("uz-UZ", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
