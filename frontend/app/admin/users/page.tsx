"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Plus, Loader2, Shield, ShieldAlert, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAuthStore } from "@/lib/store";
import api from "@/lib/api";

const userSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(["ADMIN", "SUPERADMIN"]),
});

type UserForm = z.infer<typeof userSchema>;

export default function UsersPage() {
  const queryClient = useQueryClient();
  const { user: currentUser } = useAuthStore();
  const [open, setOpen] = useState(false);

  const { data: users, isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: () => api.get("/api/users").then((r) => r.data.data),
  });

  const form = useForm<UserForm>({
    resolver: zodResolver(userSchema),
    defaultValues: { name: "", email: "", password: "", role: "ADMIN" },
  });

  const createMutation = useMutation({
    mutationFn: (d: UserForm) => api.post("/api/users", d),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["users"] }); toast.success("Admin created"); setOpen(false); form.reset(); },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/api/users/${id}`),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["users"] }); toast.success("Admin deleted"); },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold">Admin Users</h1>
          <p className="text-muted-foreground">Manage admin accounts (Super Admin only)</p>
        </div>
        <Button variant="accent" className="gap-2" onClick={() => setOpen(true)}><Plus size={16} /> Add Admin</Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12"><Loader2 size={24} className="animate-spin text-accent" /></div>
      ) : (
        <div className="space-y-3">
          {users?.map((u: any) => (
            <Card key={u.id} className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  {u.role === "SUPERADMIN" ? <ShieldAlert size={20} className="text-accent" /> : <Shield size={20} className="text-primary/60" />}
                </div>
                <div>
                  <p className="font-medium">{u.name}</p>
                  <p className="text-sm text-muted-foreground">{u.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant={u.role === "SUPERADMIN" ? "accent" : "default"}>{u.role}</Badge>
                {u.id !== currentUser?.id && (
                  <button onClick={() => { if (confirm("Delete this admin?")) deleteMutation.mutate(u.id); }} className="p-2 text-muted-foreground hover:text-destructive rounded-md hover:bg-red-50">
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Add Admin</DialogTitle></DialogHeader>
          <form onSubmit={form.handleSubmit((d) => createMutation.mutate(d))} className="space-y-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input {...form.register("name")} placeholder="John Doe" />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input {...form.register("email")} type="email" placeholder="admin@today.uz" />
            </div>
            <div className="space-y-2">
              <Label>Password</Label>
              <Input {...form.register("password")} type="password" placeholder="Min 8 characters" />
            </div>
            <div className="space-y-2">
              <Label>Role</Label>
              <select {...form.register("role")} className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm">
                <option value="ADMIN">Admin</option>
                <option value="SUPERADMIN">Super Admin</option>
              </select>
            </div>
            <Button type="submit" variant="accent" className="w-full" disabled={createMutation.isPending}>
              {createMutation.isPending ? <Loader2 size={16} className="animate-spin" /> : "Create Admin"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
