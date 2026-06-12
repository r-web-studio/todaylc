import nodemailer from "nodemailer";

let transporter: nodemailer.Transporter | null = null;

function getTransporter() {
  if (transporter) return transporter;

  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    console.warn("Email not configured - SMTP credentials missing");
    return null;
  }

  transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: parseInt(SMTP_PORT || "587"),
    secure: false,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });

  return transporter;
}

export async function sendEnrollmentNotification(enrollment: Record<string, unknown>) {
  const t = getTransporter();
  if (!t) return { success: false, reason: "Email not configured" };

  const { EMAIL_FROM } = process.env;
  const course = enrollment.course as Record<string, string>;
  const branchLabel = enrollment.branch === "URGANCH" ? "Urganch" : "Shovot";

  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><style>body{font-family:Arial,sans-serif;line-height:1.6;color:#333}.container{max-width:600px;margin:0 auto;padding:20px}.header{background:#0B1D3A;color:#F5A623;padding:20px;text-align:center}.content{padding:20px;background:#f9f9f9}.field{margin-bottom:12px}.label{font-weight:bold;color:#0B1D3A}.value{color:#555}.footer{text-align:center;padding:20px;color:#888;font-size:12px}</style></head><body><div class="container"><div class="header"><h1>Yangi Ariza</h1><p>Today Ta'lim Markazi</p></div><div class="content"><div class="field"><span class="label">Talaba:</span> <span class="value">${enrollment.studentName}</span></div><div class="field"><span class="label">Telefon:</span> <span class="value">${enrollment.studentPhone}</span></div>${enrollment.studentEmail ? `<div class="field"><span class="label">Email:</span> <span class="value">${enrollment.studentEmail}</span></div>` : ""}<div class="field"><span class="label">Kurs:</span> <span class="value">${course.titleUz}</span></div><div class="field"><span class="label">Filial:</span> <span class="value">${branchLabel}</span></div>${enrollment.message ? `<div class="field"><span class="label">Xabar:</span> <span class="value">${enrollment.message}</span></div>` : ""}</div><div class="footer">Bu xavfsiz tizimdan avtomatik yuborilgan xabardir.</div></div></body></html>`;

  try {
    await t.sendMail({
      from: EMAIL_FROM,
      to: "admin@today.uz",
      subject: `Yangi arizachi: ${enrollment.studentName} - ${course.titleUz}`,
      html,
    });
    return { success: true };
  } catch (error) {
    console.error("Email send error:", error);
    return { success: false, error: String(error) };
  }
}

export async function sendEnrollmentConfirmation(enrollment: Record<string, unknown>) {
  const t = getTransporter();
  if (!t) return { success: false, reason: "Email not configured" };

  const { EMAIL_FROM } = process.env;
  const course = enrollment.course as Record<string, string>;

  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><style>body{font-family:Arial,sans-serif;line-height:1.6;color:#333}.container{max-width:600px;margin:0 auto;padding:20px}.header{background:#0B1D3A;color:#F5A623;padding:20px;text-align:center}.content{padding:20px;background:#f9f9f9}.btn{display:inline-block;background:#F5A623;color:#0B1D3A;padding:12px 24px;text-decoration:none;border-radius:6px;font-weight:bold}</style></head><body><div class="container"><div class="header"><h1>Arizangiz Qabul Qilindi!</h1><p>Today Ta'lim Markazi</p></div><div class="content"><p>Hurmatli <strong>${enrollment.studentName}</strong>,</p><p>Arizangiz muvaffaqiyatli qabul qilindi. Tez orada bizning menejerlarimiz siz bilan bog'lanadi.</p><p><strong>Kurs:</strong> ${course.titleUz}<br><strong>Filial:</strong> ${enrollment.branch === "URGANCH" ? "Urganch" : "Shovot"}</p></div></div></body></html>`;

  try {
    await t.sendMail({
      from: EMAIL_FROM,
      to: enrollment.studentEmail as string,
      subject: "Arizangiz qabul qilindi - Today Ta'lim Markazi",
      html,
    });
    return { success: true };
  } catch (error) {
    console.error("Confirmation email error:", error);
    return { success: false, error: String(error) };
  }
}
