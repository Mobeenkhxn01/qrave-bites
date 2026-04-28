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
        <h2>New Demo Request</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong> ${message || "N/A"}</p>
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
