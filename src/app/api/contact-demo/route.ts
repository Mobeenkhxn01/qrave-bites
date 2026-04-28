import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().trim().min(2, "Name is required"),
  phone: z
    .string()
    .trim()
    .regex(/^\+?[0-9\s-]{10,15}$/, "Valid phone number required"),
  email: z.string().trim().email("Enter valid email"),
  message: z.string().trim().max(1000).optional(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = contactSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid request" },
        { status: 400 }
      );
    }

    const gmailUser = process.env.GMAIL_USER;
    const gmailAppPassword = process.env.GMAIL_APP_PASSWORD;

    if (!gmailUser || !gmailAppPassword) {
      return NextResponse.json(
        { error: "Email service is not configured" },
        { status: 500 }
      );
    }

    const { name, phone, email, message } = parsed.data;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: gmailUser,
        pass: gmailAppPassword,
      },
    });

    await transporter.sendMail({
      from: process.env.MAIL_FROM || gmailUser,
      to: "mobeenkhan191915@gmail.com",
      subject: `New QraveBites Demo Request from ${name}`,
      text: [
        "New demo request received:",
        `Name: ${name}`,
        `Phone: ${phone}`,
        `Email: ${email}`,
        `Message: ${message || "N/A"}`,
      ].join("\n"),
      html: `
  <div style="font-family: Arial, sans-serif; background:#f6f9fc; padding:40px 0;">
    <div style="max-width:600px; margin:0 auto; background:white; border-radius:12px; overflow:hidden; box-shadow:0 10px 25px rgba(0,0,0,0.08);">
      
      <!-- Header -->
      <div style="background:linear-gradient(135deg,#6366f1,#4f46e5); padding:24px; text-align:center; color:white;">
        <h1 style="margin:0; font-size:22px;">🍽️ Qrave Bites</h1>
        <p style="margin:5px 0 0; font-size:14px; opacity:0.9;">
          New Demo Request
        </p>
      </div>

      <!-- Body -->
      <div style="padding:24px;">
        <p style="font-size:15px; color:#374151;">
          You have received a new demo request from your website:
        </p>

        <!-- Info Card -->
        <div style="margin-top:20px; border:1px solid #e5e7eb; border-radius:10px; padding:16px;">
          
          <p style="margin:8px 0;"><strong>👤 Name:</strong> ${name}</p>
          <p style="margin:8px 0;"><strong>📞 Phone:</strong> ${phone}</p>
          <p style="margin:8px 0;"><strong>📧 Email:</strong> ${email}</p>
          <p style="margin:8px 0;"><strong>💬 Message:</strong> ${message || "N/A"}</p>

        </div>

        <!-- CTA -->
        <div style="margin-top:24px; text-align:center;">
          <a href="mailto:${email}" 
             style="display:inline-block; padding:12px 20px; background:#4f46e5; color:white; text-decoration:none; border-radius:8px; font-size:14px;">
            Reply to Customer
          </a>
        </div>
      </div>

      <!-- Footer -->
      <div style="background:#f9fafb; padding:16px; text-align:center; font-size:12px; color:#6b7280;">
        © ${new Date().getFullYear()} Qrave Bites • All rights reserved
      </div>

    </div>
  </div>
`,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("CONTACT_DEMO_ERROR", error);
    return NextResponse.json(
      { error: "Failed to send demo request" },
      { status: 500 }
    );
  }
}
