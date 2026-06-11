"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Plus, Loader2, MoreHorizontal, ToggleLeft, ToggleRight, Pencil, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import api from "@/lib/api";

const courseSchema = z.object({
  title: z.string().min(2),
  titleUz: z.string().min(2),
  description: z.string().min(10),
  duration: z.string().min(1),
  price: z.coerce.number().int().positive(),
  branch: z.enum(["URGANCH", "SHOVOT", "BOTH"]),
});

type CourseForm = z.infer<typeof courseSchema>;

export default function CoursesPage() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);

  const { data: courses, isLoading } = useQuery({
    queryKey: ["courses"],
    queryFn: () => api.get("/api/courses").then((r) => r.data.data),
  });

  const form = useForm<CourseForm>({
    resolver: zodResolver(courseSchema),
    defaultValues: { title: "", titleUz: "", description: "", duration: "", price: 0, branch: "BOTH" },
  });

  const createMutation = useMutation({
    mutationFn: (d: CourseForm) => api.post("/api/courses", d),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["courses"] }); toast.success("Course created"); setOpen(false); form.reset(); },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, ...d }: any) => api.put(`/api/courses/${id}`, d),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["courses"] }); toast.success("Course updated"); setOpen(false); setEditing(null); form.reset(); },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/api/courses/${id}`),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["courses"] }); toast.success("Course deactivated"); },
  });

  const openEdit = (course: any) => {
    form.reset({ title: course.title, titleUz: course.titleUz, description: course.description, duration: course.duration, price: course.price, branch: course.branch });
    setEditing(course.id);
    setOpen(true);
  };

  const openCreate = () => {
    form.reset({ title: "", titleUz: "", description: "", duration: "", price: 0, branch: "BOTH" });
    setEditing(null);
    setOpen(true);
  };

  const onSubmit = (data: CourseForm) => {
    if (editing) updateMutation.mutate({ id: editing, ...data });
    else createMutation.mutate(data);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold">Courses</h1>
          <p className="text-muted-foreground">Manage your course offerings</p>
        </div>
        <Button variant="accent" className="gap-2" onClick={openCreate}><Plus size={16} /> Add Course</Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12"><Loader2 size={24} className="animate-spin text-accent" /></div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {courses?.map((c: any, i: number) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="relative rounded-xl border bg-card p-6 shadow-sm"
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-heading font-bold text-lg">{c.titleUz}</h3>
                <Badge variant={c.isActive ? "success" : "destructive"}>{c.isActive ? "Active" : "Inactive"}</Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-4">{c.description.slice(0, 80)}...</p>
              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                <span>💰 {c.price.toLocaleString()} UZS</span>
                <span>📅 {c.duration}</span>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="gap-1" onClick={() => openEdit(c)}><Pencil size={14} /> Edit</Button>
                <Button variant="outline" size="sm" className="gap-1 text-destructive" onClick={() => deleteMutation.mutate(c.id)}><Trash2 size={14} /> Delete</Button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Course" : "Add Course"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Title (EN)</Label>
                <Input {...form.register("title")} placeholder="IELTS" />
              </div>
              <div className="space-y-2">
                <Label>Title (UZ)</Label>
                <Input {...form.register("titleUz")} placeholder="IELTS" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <textarea {...form.register("description")} className="flex h-20 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" placeholder="Course description..." />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Duration</Label>
                <Input {...form.register("duration")} placeholder="6 oy" />
              </div>
              <div className="space-y-2">
                <Label>Price (UZS)</Label>
                <Input {...form.register("price")} type="number" placeholder="350000" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Branch</Label>
              <select {...form.register("branch")} className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                <option value="BOTH">Both</option>
                <option value="URGANCH">Urganch</option>
                <option value="SHOVOT">Shovot</option>
              </select>
            </div>
            <Button type="submit" variant="accent" className="w-full" disabled={createMutation.isPending || updateMutation.isPending}>
              {createMutation.isPending || updateMutation.isPending ? <Loader2 size={16} className="animate-spin" /> : editing ? "Update" : "Create"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
