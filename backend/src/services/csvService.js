function enrollmentsToCSV(enrollments) {
  const headers = [
    "ID",
    "Talaba Ismi",
    "Telefon",
    "Email",
    "Kurs",
    "Filial",
    "Status",
    "Xabar",
    "Yuklangan Rasm",
    "Yaratilgan Sana",
    "Yangilangan Sana",
  ];

  const rows = enrollments.map((e) => [
    e.id,
    e.studentName,
    e.studentPhone,
    e.studentEmail || "",
    e.course?.titleUz || e.course?.title || "",
    e.branch === "URGANCH" ? "Urganch" : e.branch === "SHOVOT" ? "Shovot" : "Boshqa",
    e.status === "PENDING" ? "Kutilmoqda" : e.status === "CONFIRMED" ? "Tasdiqlangan" : "Bekor qilingan",
    e.message || "",
    e.photoUrl || "",
    new Date(e.enrolledAt).toLocaleString("uz-UZ"),
    new Date(e.updatedAt).toLocaleString("uz-UZ"),
  ]);

  return [headers, ...rows].map((r) => r.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")).join("\n");
}

function streamCSV(enrollments, res) {
  const csv = enrollmentsToCSV(enrollments);
  const filename = `enrollments-${new Date().toISOString().split("T")[0]}.csv`;

  res.setHeader("Content-Type", "text/csv; charset=utf-8");
  res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
  res.send(csv);
}

module.exports = { enrollmentsToCSV, streamCSV };