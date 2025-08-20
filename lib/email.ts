import nodemailer from "nodemailer";

const host = process.env.SMTP_HOST;
const port = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 587;
const user = process.env.SMTP_USER;
const pass = process.env.SMTP_PASS;
const fromAddress = process.env.EMAIL_FROM || "no-reply@example.com";
const adminAddress = process.env.ADMIN_EMAIL || "admin@example.com";

if (!host || !user || !pass) {
  console.warn(
    "[email] SMTP credentials are not fully configured. Emails will be skipped."
  );
}

function getTransport() {
  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: {
      user,
      pass,
    },
  });
}

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  if (!host || !user || !pass) return;
  const transporter = getTransport();
  await transporter.sendMail({ from: fromAddress, to, subject, html });
}

export async function notifyNewComplaint(data: {
  title: string;
  description: string;
  category: string;
  priority: string;
}) {
  const html = `
    <h2>New Complaint Submitted</h2>
    <p><strong>Title:</strong> ${data.title}</p>
    <p><strong>Category:</strong> ${data.category}</p>
    <p><strong>Priority:</strong> ${data.priority}</p>
    <p><strong>Description:</strong></p>
    <p>${data.description}</p>
  `;
  await sendEmail({
    to: adminAddress,
    subject: "New Complaint Submitted",
    html,
  });
}

export async function notifyStatusUpdate(data: {
  title: string;
  status: string;
  updatedAt: Date;
}) {
  const html = `
    <h2>Complaint Status Updated</h2>
    <p><strong>Title:</strong> ${data.title}</p>
    <p><strong>New Status:</strong> ${data.status}</p>
    <p><strong>Date:</strong> ${data.updatedAt.toLocaleString()}</p>
  `;
  await sendEmail({
    to: adminAddress,
    subject: "Complaint Status Updated",
    html,
  });
}
