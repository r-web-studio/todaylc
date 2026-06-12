"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Users, Clock, CheckCircle, XCircle, TrendingUp, UserPlus, Search, Phone, BookOpen, MapPin, Calendar, LogOut, Download } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";

interface Enrollment {
  id: string;
  name: string;
  phone: string;
  course: string;
  branch: string;
  created_at: string;
}

interface Stats {
  total: number;
  pending: number;
  confirmed: number;
  cancelled: number;
  thisWeek: number;
  lastWeek: number;
  weekDelta: number;
  branchSplit: Record<string, number>;
  byCourse: Record<string, number>;
  dailyEnrollments: Array<{ date: string; count: number }>;
}

const BRANCH_COLORS = ["#E6A817", "#0B1F3A"];

export default function AdminDashboard() {
  const router = useRouter();
  const [tab, setTab] = useState<"dashboard" | "enrollments">("dashboard");
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const token = sessionStorage.getItem("admin_token");
    if (!token) { router.replace("/admin/login"); return; }

    Promise.all([
      fetch("/api/admin", { headers: { Authorization: `Bearer ${token}` } }).then((r) => r.json()),
      fetch("/api/dashboard/stats").then((r) => r.json()),
    ]).then(([enrollData, statsData]) => {
      if (!enrollData.success) { setError(enrollData.error || "Xatolik"); setLoading(false); return; }
      setEnrollments(enrollData.data || []);
      setLoading(false);
      if (statsData.success) { setStats(statsData.data); }
      setStatsLoading(false);
    }).catch(() => {
      setError("Ma'lumotlarni yuklashda xatolik");
      setLoading(false);
      setStatsLoading(false);
    });
  }, [router]);

  const handleLogout = () => {
    sessionStorage.removeItem("admin_token");
    router.replace("/admin/login");
  };

  const filtered = enrollments.filter(
    (e) => e.name.toLowerCase().includes(search.toLowerCase()) || e.phone.includes(search) || e.course.toLowerCase().includes(search.toLowerCase())
  );

  const exportCSV = () => {
    const headers = ["ID", "Ism", "Telefon", "Kurs", "Filial", "Sana"];
    const rows = filtered.map((e) => [e.id, e.name, e.phone, e.course, e.branch, new Date(e.created_at).toLocaleDateString("uz-UZ")]);
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `enrollments-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const dailyData = stats?.dailyEnrollments?.map((d) => ({ date: new Date(d.date).toLocaleDateString("uz-UZ", { month: "short", day: "numeric" }), count: d.count })) || [];
  const courseData = Object.entries(stats?.byCourse || {}).map(([name, count]) => ({ name, count }));
  const branchData = Object.entries(stats?.branchSplit || {}).map(([name, count]) => ({ name: name === "URGANCH" ? "Urganch" : "Shovot", value: count }));

  if (loading && statsLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-gold border-t-transparent" />
      </div>
    );
  }

  if (error) {
    return <div className="flex min-h-screen items-center justify-center"><p className="text-red-500">{error}</p></div>;
  }

  return (
    <div className="space-y-6">
      {tab === "dashboard" && (
        <>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-heading text-2xl font-bold text-navy">Dashboard</h1>
              <p className="text-sm text-gray-500">Arizalar statistikasi</p>
            </div>
            <button onClick={() => setTab("enrollments")}
              className="rounded-lg bg-gold px-4 py-2 text-sm font-semibold text-navy transition-all hover:bg-gold-light">
              Arizalarni ko'rish
            </button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard title="Jami arizalar" value={stats?.total || 0} delta={stats?.weekDelta} icon={<Users size={18} />} color="bg-navy/10 text-navy" />
            <StatCard title="Kutilmoqda" value={stats?.pending || 0} icon={<Clock size={18} />} color="bg-yellow-100 text-yellow-600" />
            <StatCard title="Tasdiqlangan" value={stats?.confirmed || 0} icon={<CheckCircle size={18} />} color="bg-green-100 text-green-600" />
            <StatCard title="Bekor qilingan" value={stats?.cancelled || 0} icon={<XCircle size={18} />} color="bg-red-100 text-red-600" />
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="mb-4 font-heading font-semibold text-navy">Oxirgi 30 kunlik arizalar</h3>
              {dailyData.length > 0 ? (
                <ResponsiveContainer width="100%" height={280}>
                  <LineChart data={dailyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Line type="monotone" dataKey="count" stroke="#E6A817" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              ) : <p className="py-12 text-center text-sm text-gray-400">Ma'lumot mavjud emas</p>}
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="mb-4 font-heading font-semibold text-navy">Kurslar bo'yicha</h3>
              {courseData.length > 0 ? (
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={courseData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis type="number" tick={{ fontSize: 12 }} />
                    <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} width={90} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#E6A817" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : <p className="py-12 text-center text-sm text-gray-400">Ma'lumot mavjud emas</p>}
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="mb-4 font-heading font-semibold text-navy">Filiallar bo'yicha</h3>
              {branchData.length > 0 ? (
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie data={branchData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                      {branchData.map((_, i) => <Cell key={i} fill={BRANCH_COLORS[i % BRANCH_COLORS.length]} />)}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : <p className="py-12 text-center text-sm text-gray-400">Ma'lumot mavjud emas</p>}
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="mb-4 font-heading font-semibold text-navy">Faollik</h3>
              <div className="flex items-center gap-4 rounded-xl bg-green-50 p-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600">
                  <UserPlus size={24} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-navy">{stats?.thisWeek || 0}</p>
                  <p className="text-sm text-gray-500">Shu haftadagi arizalar</p>
                </div>
              </div>
              {stats && stats.lastWeek > 0 && (
                <div className="mt-4 flex items-center gap-2 text-sm">
                  <TrendingUp size={16} className={stats.weekDelta >= 0 ? "text-green-500" : "text-red-500"} />
                  <span className={stats.weekDelta >= 0 ? "text-green-600" : "text-red-600"}>
                    {stats.weekDelta >= 0 ? "+" : ""}{stats.weekDelta}% o'tgan haftaga nisbatan
                  </span>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {tab === "enrollments" && (
        <>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-heading text-2xl font-bold text-navy">Arizalar</h1>
              <p className="text-sm text-gray-500">{enrollments.length} ta ariza</p>
            </div>
            <div className="flex gap-2">
              <button onClick={exportCSV}
                className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-600 transition-colors hover:border-gold hover:text-gold">
                <Download size={14} /> CSV
              </button>
              <button onClick={() => setTab("dashboard")}
                className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-600 transition-colors hover:border-gold hover:text-gold">
                Dashboard
              </button>
              <button onClick={handleLogout}
                className="flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-2 text-xs font-medium text-red-500 transition-colors hover:border-red-300 hover:bg-red-50">
                <LogOut size={14} /> Chiqish
              </button>
            </div>
          </div>

          <div className="relative max-w-md">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Ism, telefon yoki kurs bo'yicha qidirish..."
              className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none transition-all focus:border-gold focus:ring-2 focus:ring-gold/20" />
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
                      <th className="px-5 py-3.5 font-semibold text-gray-600">Ism</th>
                      <th className="px-5 py-3.5 font-semibold text-gray-600">Telefon</th>
                      <th className="px-5 py-3.5 font-semibold text-gray-600">Kurs</th>
                      <th className="px-5 py-3.5 font-semibold text-gray-600">Filial</th>
                      <th className="px-5 py-3.5 font-semibold text-gray-600">Sana</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((e) => (
                      <tr key={e.id} className="border-b border-gray-50 transition-colors hover:bg-gold/5 last:border-0">
                        <td className="px-5 py-4 font-medium text-navy">{e.name}</td>
                        <td className="px-5 py-4">
                          <a href={`tel:${e.phone}`} className="text-gold transition-colors hover:text-gold-dark">{e.phone}</a>
                        </td>
                        <td className="px-5 py-4">
                          <span className="inline-block rounded-full bg-gold/10 px-3 py-1 text-xs font-medium text-gold-dark">{e.course}</span>
                        </td>
                        <td className="px-5 py-4 text-sm text-gray-600">{e.branch}</td>
                        <td className="px-5 py-4 text-sm text-gray-400">
                          {new Date(e.created_at).toLocaleDateString("uz-UZ", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function StatCard({ title, value, delta, icon, color }: { title: string; value: number | string; delta?: number; icon: React.ReactNode; color: string }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${color}`}>{icon}</div>
        {delta !== undefined && (
          <div className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${delta >= 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
            <TrendingUp size={12} />
            {Math.abs(delta)}%
          </div>
        )}
      </div>
      <p className="mt-4 text-2xl font-bold text-navy">{value}</p>
      <p className="text-sm text-gray-500">{title}</p>
    </div>
  );
}
