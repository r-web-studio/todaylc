"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Search, ChevronDown, ChevronUp, Download, Trash2, Eye, MoreHorizontal } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import api from "@/lib/api";

const statusBadge: Record<string, "warning" | "success" | "destructive"> = {
  PENDING: "warning",
  CONFIRMED: "success",
  CANCELLED: "destructive",
};

const statusLabel: Record<string, string> = {
  PENDING: "Pending",
  CONFIRMED: "Confirmed",
  CANCELLED: "Cancelled",
};

export function EnrollTable() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("enrolledAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [selected, setSelected] = useState<string[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["enrollments", page, search, sortBy, sortOrder],
    queryFn: () => api.get("/api/enrollments", { params: { page, limit: 20, search, sortBy, sortOrder } }).then((r) => r.data.data),
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => api.patch(`/api/enrollments/${id}/status`, { status }),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["enrollments"] }); toast.success("Status updated"); },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/api/enrollments/${id}`),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["enrollments"] }); toast.success("Deleted"); },
  });

  const toggleSort = (field: string) => {
    if (sortBy === field) setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    else { setSortBy(field); setSortOrder("asc"); }
  };

  const toggleAll = () => {
    if (selected.length === data?.enrollments?.length) setSelected([]);
    else setSelected(data?.enrollments?.map((e: any) => e.id) || []);
  };

  const toggleOne = (id: string) => {
    setSelected((prev) => prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]);
  };

  return (
    <Card className="p-0 overflow-hidden">
      <div className="flex items-center gap-4 p-4 border-b">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder="Search by name, phone, email..." className="pl-9" />
        </div>
        <Button variant="outline" size="sm" className="gap-2" onClick={() => window.open(`/api/enrollments/export/csv?search=${search}`, "_blank")}>
          <Download size={14} /> CSV
        </Button>
        {selected.length > 0 && (
          <span className="text-sm text-muted-foreground">{selected.length} selected</span>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="w-10 px-4 py-3"><input type="checkbox" checked={selected.length === data?.enrollments?.length && data?.enrollments?.length > 0} onChange={toggleAll} className="rounded" /></th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground cursor-pointer" onClick={() => toggleSort("studentName")}>
                Name {sortBy === "studentName" && (sortOrder === "asc" ? <ChevronUp size={14} className="inline" /> : <ChevronDown size={14} className="inline" />)}
              </th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Phone</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Course</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Branch</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground cursor-pointer" onClick={() => toggleSort("status")}>
                Status {sortBy === "status" && (sortOrder === "asc" ? <ChevronUp size={14} className="inline" /> : <ChevronDown size={14} className="inline" />)}
              </th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground cursor-pointer" onClick={() => toggleSort("enrolledAt")}>
                Date {sortBy === "enrolledAt" && (sortOrder === "asc" ? <ChevronUp size={14} className="inline" /> : <ChevronDown size={14} className="inline" />)}
              </th>
              <th className="w-20 px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={8} className="p-12 text-center text-muted-foreground">Loading...</td></tr>
            ) : data?.enrollments?.length === 0 ? (
              <tr><td colSpan={8} className="p-12 text-center text-muted-foreground">No enrollments found</td></tr>
            ) : (
              data?.enrollments?.map((e: any, i: number) => (
                <motion.tr
                  key={e.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.02 }}
                  className={cn("border-b last:border-0 transition-colors hover:bg-muted/30", selected.includes(e.id) && "bg-accent/5")}
                >
                  <td className="px-4 py-3"><input type="checkbox" checked={selected.includes(e.id)} onChange={() => toggleOne(e.id)} className="rounded" /></td>
                  <td className="px-4 py-3 font-medium">{e.studentName}</td>
                  <td className="px-4 py-3"><a href={`tel:${e.studentPhone}`} className="text-accent hover:underline">{e.studentPhone}</a></td>
                  <td className="px-4 py-3">{e.course?.titleUz || e.course?.title}</td>
                  <td className="px-4 py-3">{e.branch === "URGANCH" ? "Urganch" : "Shovot"}</td>
                  <td className="px-4 py-3">
                    <select
                      value={e.status}
                      onChange={(ev) => statusMutation.mutate({ id: e.id, status: ev.target.value })}
                      className={cn("rounded-lg border px-2 py-1 text-xs font-medium", e.status === "PENDING" ? "border-yellow-200 bg-yellow-50 text-yellow-700" : e.status === "CONFIRMED" ? "border-green-200 bg-green-50 text-green-700" : "border-red-200 bg-red-50 text-red-700")}
                    >
                      <option value="PENDING">Pending</option>
                      <option value="CONFIRMED">Confirmed</option>
                      <option value="CANCELLED">Cancelled</option>
                    </select>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{new Date(e.enrolledAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <button onClick={() => setExpanded(expanded === e.id ? null : e.id)} className="p-1.5 rounded-md hover:bg-gray-100">
                        <Eye size={14} />
                      </button>
                      <button onClick={() => { if (confirm("Delete this enrollment?")) deleteMutation.mutate(e.id); }} className="p-1.5 rounded-md hover:bg-red-50 text-red-500">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {data?.totalPages > 1 && (
        <div className="flex items-center justify-between border-t px-4 py-3">
          <span className="text-sm text-muted-foreground">Page {page} of {data.totalPages}</span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(page - 1)}>Previous</Button>
            <Button variant="outline" size="sm" disabled={page >= data.totalPages} onClick={() => setPage(page + 1)}>Next</Button>
          </div>
        </div>
      )}
    </Card>
  );
}
