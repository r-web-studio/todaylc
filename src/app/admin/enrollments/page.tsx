"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Download, ChevronUp, ChevronDown } from "lucide-react";

interface Enr {
  id: string;
  studentName: string;
  studentPhone: string;
  studentEmail?: string;
  course?: { title?: string; titleUz?: string; duration?: string; price?: number };
  branch: string;
  status: string;
  message?: string;
  photoUrl?: string;
  enrolledAt: string;
  updatedAt: string;
}

export default function AdminEnrollments() {
  const router = useRouter();
  const [data, setData] = useState<{ enrollments: Enr[]; total: number; page: number; limit: number; totalPages: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("enrolledAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [viewDetail, setViewDetail] = useState<Enr | null>(null);

  useEffect(() => {
    const token = sessionStorage.getItem("admin_token");
    if (!token) { router.replace("/admin/login"); return; }

    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: "20", sortBy, sortOrder });
    if (search) params.append("search", search);

    fetch(`/api/enrollments?${params}`, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((res) => {
        if (!res.success) { setError(res.message || "Xatolik"); setLoading(false); return; }
        setData(res.data);
        setLoading(false);
      })
      .catch(() => { setError("Ma'lumotlarni yuklashda xatolik"); setLoading(false); });
  }, [router, page, sortBy, sortOrder]);

  useEffect(() => {
    const timer = setTimeout(() => setPage(1), 300);
    return () => clearTimeout(timer);
  }, [search]);

  const toggleSort = (field: string) => {
    if (sortBy === field) setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    else { setSortBy(field); setSortOrder("asc"); }
  };

  const exportCSV = async () => {
    const token = sessionStorage.getItem("admin_token");
    const params = new URLSearchParams();
    if (search) params.append("search", search);
    try {
      const res = await fetch(`/api/enrollments/export/csv?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) return;
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `enrollments-${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {}
  };

  const SortIcon = ({ field }: { field: string }) => {
    if (sortBy !== field) return null;
    return sortOrder === "asc" ? <ChevronUp size={14} className="inline ml-1" /> : <ChevronDown size={14} className="inline ml-1" />;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-navy">Arizalar</h1>
          <p className="text-sm text-gray-500">{data?.total || 0} ta ariza</p>
        </div>
        <button onClick={exportCSV}
          className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-600 transition-colors hover:border-gold hover:text-gold">
          <Download size={14} /> CSV
        </button>
      </div>

      <div className="relative max-w-md">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Ism, telefon bo'yicha qidirish..."
          className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none transition-all focus:border-gold focus:ring-2 focus:ring-gold/20" />
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gold border-t-transparent" />
        </div>
      ) : error ? (
        <p className="text-center text-red-500 py-8">{error}</p>
      ) : !data?.enrollments?.length ? (
        <div className="rounded-2xl border border-gray-200 bg-white p-16 text-center">
          <p className="text-gray-500">Arizalar mavjud emas</p>
        </div>
      ) : (
        <>
          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/80">
                    <th className="px-5 py-3.5 font-semibold text-gray-600 cursor-pointer select-none" onClick={() => toggleSort("studentName")}>
                      Ism <SortIcon field="studentName" />
                    </th>
                    <th className="px-5 py-3.5 font-semibold text-gray-600">Telefon</th>
                    <th className="px-5 py-3.5 font-semibold text-gray-600">Kurs</th>
                    <th className="px-5 py-3.5 font-semibold text-gray-600">Filial</th>
                    <th className="px-5 py-3.5 font-semibold text-gray-600 cursor-pointer select-none" onClick={() => toggleSort("status")}>
                      Status <SortIcon field="status" />
                    </th>
                    <th className="px-5 py-3.5 font-semibold text-gray-600 cursor-pointer select-none" onClick={() => toggleSort("enrolledAt")}>
                      Sana <SortIcon field="enrolledAt" />
                    </th>
                    <th className="px-5 py-3.5" />
                  </tr>
                </thead>
                <tbody>
                  {data.enrollments.map((e) => (
                    <tr key={e.id} className="border-b border-gray-50 transition-colors hover:bg-gold/5 last:border-0">
                      <td className="px-5 py-4 font-medium text-navy">{e.studentName}</td>
                      <td className="px-5 py-4">
                        <a href={`tel:${e.studentPhone}`} className="text-gold transition-colors hover:text-gold-dark">{e.studentPhone}</a>
                      </td>
                      <td className="px-5 py-4">
                        <span className="inline-block rounded-full bg-gold/10 px-3 py-1 text-xs font-medium text-gold-dark">
                          {e.course?.titleUz || e.course?.title}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-sm text-gray-600">
                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${e.branch === "URGANCH" ? "bg-blue-50 text-blue-700" : "bg-indigo-50 text-indigo-700"}`}>
                          {e.branch === "URGANCH" ? "Urganch" : "Shovot"}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${
                          e.status === "PENDING" ? "bg-yellow-50 text-yellow-700" :
                          e.status === "CONFIRMED" ? "bg-green-50 text-green-700" :
                          "bg-red-50 text-red-700"
                        }`}>
                          {e.status === "PENDING" ? "Kutilmoqda" : e.status === "CONFIRMED" ? "Tasdiqlangan" : "Bekor"}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-sm text-gray-400">
                        {new Date(e.enrolledAt).toLocaleDateString("uz-UZ", { day: "numeric", month: "short", year: "numeric" })}
                      </td>
                      <td className="px-5 py-4">
                        <button onClick={() => setViewDetail(e)}
                          className="rounded-lg px-3 py-1.5 text-xs font-medium text-gold-dark transition-all hover:bg-gold/10">
                          Batafsil
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {data.totalPages > 1 && (
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">{data.page} / {data.totalPages} sahifa ({data.total} ta)</span>
              <div className="flex gap-2">
                <button disabled={page <= 1} onClick={() => setPage(page - 1)}
                  className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 transition-all hover:border-gold hover:text-gold disabled:opacity-40">
                  Oldingi
                </button>
                <button disabled={page >= data.totalPages} onClick={() => setPage(page + 1)}
                  className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 transition-all hover:border-gold hover:text-gold disabled:opacity-40">
                  Keyingi
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {viewDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setViewDetail(null)}>
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="mb-4 font-heading text-lg font-bold text-navy">Ariza tafsilotlari</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-500">Ism:</span>
                <span className="font-semibold text-navy">{viewDetail.studentName}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-500">Telefon:</span>
                <a href={`tel:${viewDetail.studentPhone}`} className="font-semibold text-gold">{viewDetail.studentPhone}</a>
              </div>
              {viewDetail.studentEmail && (
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-500">Email:</span>
                  <span className="font-semibold text-navy">{viewDetail.studentEmail}</span>
                </div>
              )}
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-500">Kurs:</span>
                <span className="font-semibold text-navy">{viewDetail.course?.titleUz || viewDetail.course?.title}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-500">Filial:</span>
                <span className="font-semibold text-navy">{viewDetail.branch === "URGANCH" ? "Urganch" : "Shovot"}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-500">Status:</span>
                <span className={`font-bold ${
                  viewDetail.status === "CONFIRMED" ? "text-green-600" :
                  viewDetail.status === "CANCELLED" ? "text-red-600" : "text-yellow-600"
                }`}>
                  {viewDetail.status === "PENDING" ? "Kutilmoqda" : viewDetail.status === "CONFIRMED" ? "Tasdiqlangan" : "Bekor qilingan"}
                </span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-500">Sana:</span>
                <span className="font-semibold text-navy">{new Date(viewDetail.enrolledAt).toLocaleString("uz-UZ")}</span>
              </div>
              {viewDetail.message && (
                <div className="border-b pb-2">
                  <span className="text-gray-500">Xabar:</span>
                  <p className="mt-1 italic text-gray-700">{viewDetail.message}</p>
                </div>
              )}
            </div>
            <button onClick={() => setViewDetail(null)}
              className="mt-6 w-full rounded-xl bg-gold py-2.5 text-sm font-semibold text-navy transition-all hover:bg-gold-light">
              Yopish
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
