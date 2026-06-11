"use client";

import { useQuery } from "@tanstack/react-query";
import { Loader2, Users, Clock, CheckCircle, XCircle, TrendingUp, UserPlus } from "lucide-react";
import { StatsCard } from "@/components/admin/stats-card";
import { Card } from "@/components/ui/card";
import api from "@/lib/api";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function DashboardPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: () => api.get("/api/dashboard/stats").then((r) => r.data.data),
    refetchInterval: 30000,
  });

  if (isLoading) return <div className="flex items-center justify-center h-64"><Loader2 size={32} className="animate-spin text-accent" /></div>;

  const dailyData = data?.dailyEnrollments?.map((d: any) => ({ date: new Date(d.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }), count: Number(d.count) })) || [];
  const courseData = Object.entries(data?.byCourse || {}).map(([name, count]) => ({ name, count }));
  const branchData = Object.entries(data?.branchSplit || {}).map(([name, count]) => ({ name: name === "URGANCH" ? "Urganch" : "Shovot", value: count }));
  const BRANCH_COLORS = ["#F5A623", "#0B1D3A"];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your enrollment data</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard title="Total Enrollments" value={data?.total || 0} delta={data?.weekDelta} icon={<Users size={18} />} />
        <StatsCard title="Pending" value={data?.pending || 0} icon={<Clock size={18} />} variant="warning" />
        <StatsCard title="Confirmed" value={data?.confirmed || 0} icon={<CheckCircle size={18} />} variant="success" />
        <StatsCard title="Cancelled" value={data?.cancelled || 0} icon={<XCircle size={18} />} variant="destructive" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <h3 className="font-heading font-semibold mb-4">Enrollments (Last 30 Days)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dailyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="#F5A623" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <h3 className="font-heading font-semibold mb-4">By Course</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={courseData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis type="number" tick={{ fontSize: 12 }} />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} width={100} />
              <Tooltip />
              <Bar dataKey="count" fill="#F5A623" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <h3 className="font-heading font-semibold mb-4">Branch Split</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={branchData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                {branchData.map((_, i) => <Cell key={i} fill={BRANCH_COLORS[i % BRANCH_COLORS.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <h3 className="font-heading font-semibold mb-4">Activity</h3>
          <div className="flex items-center gap-4 p-4 bg-green-50 rounded-lg">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-green-600">
              <UserPlus size={20} />
            </div>
            <div>
              <p className="text-2xl font-bold">{data?.thisWeek || 0}</p>
              <p className="text-sm text-muted-foreground">Enrollments this week</p>
            </div>
          </div>
          {data?.lastWeek > 0 && (
            <div className="mt-4 flex items-center gap-2 text-sm">
              <TrendingUp size={16} className={data.weekDelta >= 0 ? "text-green-500" : "text-red-500"} />
              <span className={data.weekDelta >= 0 ? "text-green-600" : "text-red-600"}>
                {data.weekDelta >= 0 ? "+" : ""}{data.weekDelta}% vs last week
              </span>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
