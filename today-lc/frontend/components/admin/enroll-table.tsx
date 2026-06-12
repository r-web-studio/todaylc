"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Search, ChevronDown, ChevronUp, Download, Trash2, Eye, X, CheckCircle, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAuthStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import api, { API_BASE } from "@/lib/api";

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
  const { user: currentUser } = useAuthStore();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [filterCourse, setFilterCourse] = useState("");
  const [filterBranch, setFilterBranch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [sortBy, setSortBy] = useState("enrolledAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [selected, setSelected] = useState<string[]>([]);
  const [viewDetail, setViewDetail] = useState<any | null>(null);

  // Debounce search query
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 300);
    return () => clearTimeout(handler);
  }, [search]);

  // Fetch list of courses for filter dropdown
  const { data: courses } = useQuery({
    queryKey: ["courses-list-filter"],
    queryFn: () => api.get("/api/courses").then((r) => r.data.data),
  });

  // Fetch filtered and paginated enrollments
  const { data, isLoading } = useQuery({
    queryKey: ["enrollments", page, debouncedSearch, filterCourse, filterBranch, filterStatus, sortBy, sortOrder],
    queryFn: () =>
      api
        .get("/api/enrollments", {
          params: {
            page,
            limit: 10,
            search: debouncedSearch,
            course: filterCourse || undefined,
            branch: filterBranch || undefined,
            status: filterStatus || undefined,
            sortBy,
            sortOrder,
          },
        })
        .then((r) => r.data.data),
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => api.patch(`/api/enrollments/${id}/status`, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["enrollments"] });
      toast.success("Status updated");
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to update status");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/api/enrollments/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["enrollments"] });
      toast.success("Enrollment deleted successfully");
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to delete enrollment (Only Superadmins can delete)");
    },
  });

  // Bulk mutations
  const bulkStatusMutation = useMutation({
    mutationFn: async ({ ids, status }: { ids: string[]; status: string }) => {
      return Promise.all(ids.map((id) => api.patch(`/api/enrollments/${id}/status`, { status })));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["enrollments"] });
      setSelected([]);
      toast.success("Selected enrollments updated");
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to perform bulk update");
    },
  });

  const bulkDeleteMutation = useMutation({
    mutationFn: async (ids: string[]) => {
      return Promise.all(ids.map((id) => api.delete(`/api/enrollments/${id}`)));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["enrollments"] });
      setSelected([]);
      toast.success("Selected enrollments deleted");
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to perform bulk delete (Requires Superadmin)");
    },
  });

  const toggleSort = (field: string) => {
    if (sortBy === field) setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  const toggleAll = () => {
    if (selected.length === data?.enrollments?.length && data?.enrollments?.length > 0) {
      setSelected([]);
    } else {
      setSelected(data?.enrollments?.map((e: any) => e.id) || []);
    }
  };

  const toggleOne = (id: string) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  const handleBulkStatus = (status: "CONFIRMED" | "CANCELLED") => {
    if (selected.length === 0) return;
    bulkStatusMutation.mutate({ ids: selected, status });
  };

  const handleBulkDelete = () => {
    if (selected.length === 0) return;
    if (currentUser?.role !== "SUPERADMIN") {
      toast.error("Only Superadmins can delete enrollments");
      return;
    }
    if (confirm(`Are you sure you want to permanently delete the ${selected.length} selected enrollments?`)) {
      bulkDeleteMutation.mutate(selected);
    }
  };

  const getCsvUrl = () => {
    const params = new URLSearchParams();
    if (debouncedSearch) params.append("search", debouncedSearch);
    if (filterCourse) params.append("course", filterCourse);
    if (filterBranch) params.append("branch", filterBranch);
    if (filterStatus) params.append("status", filterStatus);
    return `/api/enrollments/export/csv?${params.toString()}`;
  };

  return (
    <div className="space-y-4">
      {/* Filters and Search Bar */}
      <Card className="p-4 space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by student name, phone, email..."
              className="pl-9 w-full"
            />
          </div>

          {/* Filters container */}
          <div className="grid grid-cols-2 md:flex md:items-center gap-2">
            <select
              value={filterCourse}
              onChange={(e) => {
                setFilterCourse(e.target.value);
                setPage(1);
              }}
              className="flex h-10 w-full md:w-48 rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
            >
              <option value="">All Courses</option>
              {courses?.map((c: any) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </select>

            <select
              value={filterBranch}
              onChange={(e) => {
                setFilterBranch(e.target.value);
                setPage(1);
              }}
              className="flex h-10 w-full md:w-36 rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
            >
              <option value="">All Branches</option>
              <option value="URGANCH">Urganch</option>
              <option value="SHOVOT">Shovot</option>
            </select>

            <select
              value={filterStatus}
              onChange={(e) => {
                setFilterStatus(e.target.value);
                setPage(1);
              }}
              className="flex h-10 w-full md:w-36 rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
            >
              <option value="">All Statuses</option>
              <option value="PENDING">Pending</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>

            <Button
              variant="outline"
              size="sm"
              className="h-10 gap-2 border flex-1 md:flex-initial"
              onClick={() => window.open(`${API_BASE}${getCsvUrl()}`, "_blank")}
            >
              <Download size={14} /> Export CSV
            </Button>
          </div>
        </div>

        {/* Bulk Action Controls */}
        {selected.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="flex items-center justify-between border-t pt-3 mt-2 text-sm"
          >
            <div className="flex items-center gap-2 text-muted-foreground font-medium">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-accent/20 text-accent text-xs">
                {selected.length}
              </span>
              selected enrollments
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="text-green-600 hover:text-green-700 hover:bg-green-50 border-green-200"
                onClick={() => handleBulkStatus("CONFIRMED")}
              >
                <CheckCircle size={14} className="mr-1" /> Confirm
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50 border-yellow-200"
                onClick={() => handleBulkStatus("CANCELLED")}
              >
                <X size={14} className="mr-1" /> Cancel
              </Button>
              {currentUser?.role === "SUPERADMIN" && (
                <Button
                  variant="destructive"
                  size="sm"
                  className="gap-1.5"
                  onClick={handleBulkDelete}
                >
                  <Trash2 size={14} /> Delete
                </Button>
              )}
            </div>
          </motion.div>
        )}
      </Card>

      {/* Enrollments Table */}
      <Card className="overflow-hidden border">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="w-10 px-4 py-3">
                  <input
                    type="checkbox"
                    checked={selected.length === data?.enrollments?.length && data?.enrollments?.length > 0}
                    onChange={toggleAll}
                    className="rounded border-gray-300 text-accent focus:ring-accent cursor-pointer"
                  />
                </th>
                <th
                  className="px-4 py-3 text-left font-semibold text-muted-foreground cursor-pointer select-none"
                  onClick={() => toggleSort("studentName")}
                >
                  Name {sortBy === "studentName" && (sortOrder === "asc" ? <ChevronUp size={14} className="inline ml-1" /> : <ChevronDown size={14} className="inline ml-1" />)}
                </th>
                <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Phone</th>
                <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Course</th>
                <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Branch</th>
                <th
                  className="px-4 py-3 text-left font-semibold text-muted-foreground cursor-pointer select-none"
                  onClick={() => toggleSort("status")}
                >
                  Status {sortBy === "status" && (sortOrder === "asc" ? <ChevronUp size={14} className="inline ml-1" /> : <ChevronDown size={14} className="inline ml-1" />)}
                </th>
                <th
                  className="px-4 py-3 text-left font-semibold text-muted-foreground cursor-pointer select-none"
                  onClick={() => toggleSort("enrolledAt")}
                >
                  Date {sortBy === "enrolledAt" && (sortOrder === "asc" ? <ChevronUp size={14} className="inline ml-1" /> : <ChevronDown size={14} className="inline ml-1" />)}
                </th>
                <th className="w-24 px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="p-12 text-center text-muted-foreground">
                    <div className="flex justify-center items-center gap-2">
                      <Loader2 size={18} className="animate-spin text-accent" /> Loading enrollments...
                    </div>
                  </td>
                </tr>
              ) : data?.enrollments?.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-12 text-center text-muted-foreground font-medium">
                    No enrollments found matching the criteria
                  </td>
                </tr>
              ) : (
                data?.enrollments?.map((e: any, i: number) => (
                  <tr
                    key={e.id}
                    className={cn(
                      "border-b last:border-0 transition-colors hover:bg-muted/40",
                      selected.includes(e.id) && "bg-accent/5 hover:bg-accent/10"
                    )}
                  >
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selected.includes(e.id)}
                        onChange={() => toggleOne(e.id)}
                        className="rounded border-gray-300 text-accent focus:ring-accent cursor-pointer"
                      />
                    </td>
                    <td className="px-4 py-3 font-semibold text-primary">{e.studentName}</td>
                    <td className="px-4 py-3 font-medium">
                      <a href={`tel:${e.studentPhone}`} className="text-accent hover:underline">
                        {e.studentPhone}
                      </a>
                    </td>
                    <td className="px-4 py-3">{e.course?.titleUz || e.course?.title}</td>
                    <td className="px-4 py-3">
                      <Badge variant="outline" className={e.branch === "URGANCH" ? "border-blue-200 text-blue-700 bg-blue-50" : "border-indigo-200 text-indigo-700 bg-indigo-50"}>
                        {e.branch === "URGANCH" ? "Urganch" : "Shovot"}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={e.status}
                        onChange={(ev) => statusMutation.mutate({ id: e.id, status: ev.target.value })}
                        className={cn(
                          "rounded-lg border px-2 py-1.5 text-xs font-bold focus:outline-none focus:ring-1 focus:ring-accent cursor-pointer",
                          e.status === "PENDING"
                            ? "border-yellow-200 bg-yellow-50 text-yellow-700"
                            : e.status === "CONFIRMED"
                            ? "border-green-200 bg-green-50 text-green-700"
                            : "border-red-200 bg-red-50 text-red-700"
                        )}
                      >
                        <option value="PENDING">Pending</option>
                        <option value="CONFIRMED">Confirmed</option>
                        <option value="CANCELLED">Cancelled</option>
                      </select>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground font-medium">
                      {new Date(e.enrolledAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setViewDetail(e)}
                          className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-primary transition-all"
                          title="View Details"
                        >
                          <Eye size={16} />
                        </button>
                        {currentUser?.role === "SUPERADMIN" ? (
                          <button
                            onClick={() => {
                              if (confirm(`Are you sure you want to permanently delete the enrollment of ${e.studentName}?`)) {
                                deleteMutation.mutate(e.id);
                              }
                            }}
                            className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-destructive transition-all"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        ) : (
                          <button
                            onClick={() => toast.error("Only Superadmins can delete enrollments")}
                            className="p-1.5 rounded-lg text-gray-200 cursor-not-allowed"
                            title="Delete (Superadmin only)"
                            disabled
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination controls */}
        {data?.totalPages > 1 && (
          <div className="flex items-center justify-between border-t px-4 py-3 bg-muted/10">
            <span className="text-xs text-muted-foreground font-medium">
              Showing page {page} of {data.totalPages} (Total: {data.total} enrollments)
            </span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
                className="h-8 text-xs font-semibold"
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= data.totalPages}
                onClick={() => setPage(page + 1)}
                className="h-8 text-xs font-semibold"
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Details View Drawer/Dialog */}
      <Dialog open={!!viewDetail} onOpenChange={() => setViewDetail(null)}>
        <DialogContent className="sm:max-w-[550px] p-6">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between border-b pb-3 text-xl font-heading font-bold text-primary">
              Enrollment Details
            </DialogTitle>
          </DialogHeader>

          {viewDetail && (
            <div className="space-y-6 pt-3">
              {/* Photo & Main Details */}
              <div className="flex flex-col sm:flex-row gap-5 items-center sm:items-start">
                {viewDetail.photoUrl ? (
                  <div className="relative w-32 h-32 rounded-xl overflow-hidden border shadow-sm shrink-0 bg-muted">
                    <img
                      src={`${API_BASE}${viewDetail.photoUrl}`}
                      alt={viewDetail.studentName}
                      className="w-full h-full object-cover"
                      onError={(e: any) => {
                        e.target.src = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80"; // fallback default user avatar
                      }}
                    />
                  </div>
                ) : (
                  <div className="w-32 h-32 rounded-xl border border-dashed flex flex-col items-center justify-center text-muted-foreground text-xs bg-muted/30 p-4 shrink-0 text-center">
                    <Eye size={20} className="mb-1 text-muted-foreground/50" />
                    No Photo Uploaded
                  </div>
                )}

                <div className="space-y-2.5 flex-1 w-full">
                  <div>
                    <h3 className="text-lg font-bold text-primary">{viewDetail.studentName}</h3>
                    <div className="mt-1 flex gap-2">
                      <Badge variant={statusBadge[viewDetail.status] as any}>
                        {statusLabel[viewDetail.status]}
                      </Badge>
                      <Badge variant="outline" className={viewDetail.branch === "URGANCH" ? "border-blue-200 text-blue-700 bg-blue-50" : "border-indigo-200 text-indigo-700 bg-indigo-50"}>
                        {viewDetail.branch === "URGANCH" ? "Urganch" : "Shovot"}
                      </Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-y-1.5 text-sm">
                    <span className="text-muted-foreground font-medium">Phone:</span>
                    <span className="col-span-2 font-bold text-primary">
                      <a href={`tel:${viewDetail.studentPhone}`} className="text-accent hover:underline">
                        {viewDetail.studentPhone}
                      </a>
                    </span>

                    <span className="text-muted-foreground font-medium">Email:</span>
                    <span className="col-span-2 font-medium text-gray-700 break-all">
                      {viewDetail.studentEmail || "—"}
                    </span>

                    <span className="text-muted-foreground font-medium">Applied On:</span>
                    <span className="col-span-2 font-medium text-gray-700">
                      {new Date(viewDetail.enrolledAt).toLocaleString("en-US", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Course Detail Block */}
              <div className="rounded-xl border bg-muted/20 p-4 space-y-2">
                <h4 className="font-bold text-primary text-sm flex items-center gap-1.5">
                  <span className="flex h-2 w-2 rounded-full bg-accent" /> Selected Course
                </h4>
                <div className="grid grid-cols-3 gap-y-1 text-sm pt-1">
                  <span className="text-muted-foreground">Title:</span>
                  <span className="col-span-2 font-semibold text-primary">{viewDetail.course?.title} (Uzbek: {viewDetail.course?.titleUz})</span>

                  <span className="text-muted-foreground">Duration:</span>
                  <span className="col-span-2 font-medium">{viewDetail.course?.duration}</span>

                  <span className="text-muted-foreground">Price:</span>
                  <span className="col-span-2 font-semibold text-accent">{viewDetail.course?.price?.toLocaleString("uz-UZ")} UZS/month</span>
                </div>
              </div>

              {/* Student Message */}
              <div className="space-y-1.5">
                <h4 className="font-bold text-primary text-sm">Student Message / Notes:</h4>
                <div className="rounded-lg bg-gray-50 border p-3.5 text-sm italic text-gray-600 min-h-[60px] whitespace-pre-wrap">
                  {viewDetail.message ? `"${viewDetail.message}"` : "No message provided by the student."}
                </div>
              </div>

              {/* Actions inside Detail Dialog */}
              <div className="flex justify-end gap-2 border-t pt-4">
                <Button variant="outline" size="sm" onClick={() => setViewDetail(null)} className="h-9">
                  Close Details
                </Button>
                {viewDetail.status === "PENDING" && (
                  <Button
                    variant="accent"
                    size="sm"
                    className="h-9 gap-1 text-accent-foreground font-semibold"
                    onClick={() => {
                      statusMutation.mutate({ id: viewDetail.id, status: "CONFIRMED" });
                      setViewDetail(null);
                    }}
                  >
                    Confirm Student
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
