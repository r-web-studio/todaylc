"use client";

import { EnrollTable } from "@/components/admin/enroll-table";

export default function EnrollmentsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold">Enrollments</h1>
        <p className="text-muted-foreground">Manage student enrollments</p>
      </div>
      <EnrollTable />
    </div>
  );
}
