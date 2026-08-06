import { NextResponse } from "next/server";
import { z } from "zod";

import {
  inquiryConfirmationEmail,
  inquiryTeamEmail,
} from "@/lib/email-templates";
import { contactRecipients, sendThemedMail } from "@/lib/mail";

const contactSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(200),
  phone: z.string().trim().max(40).optional(),
  interest: z.enum(["Kids", "School", "Coaching"]),
  message: z.string().trim().min(10).max(4000),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = contactSchema.parse(body);
    const team = contactRecipients();

    const teamText = [
      "New inquiry from the Hikaru Chess Elites website.",
      "",
      `Name: ${data.name}`,
      `Email: ${data.email}`,
      `Phone: ${data.phone?.trim() || "not provided"}`,
      `Interest: ${data.interest}`,
      "",
      "Message:",
      data.message,
    ].join("\n");

    const confirmText = [
      `Hi ${data.name},`,
      "",
      "Thanks for reaching out to Hikaru Chess Elites.",
      "We received your inquiry and will get back to you soon.",
      "",
      `Interest: ${data.interest}`,
      "",
      "Your message:",
      data.message,
      "",
      "See you at the board,",
      "Hikaru Chess Elites",
    ].join("\n");

    await sendThemedMail({
      fromId: "info",
      to: team,
      replyTo: `"${data.name}" <${data.email}>`,
      subject: `[Hikaru inquiry] ${data.interest} · ${data.name}`,
      text: teamText,
      html: inquiryTeamEmail(data),
    });

    await sendThemedMail({
      fromId: "info",
      to: data.email,
      replyTo: "info@hikaru-chess-elites.online",
      subject: "We got your message · Hikaru Chess Elites",
      text: confirmText,
      html: inquiryConfirmationEmail(data),
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { ok: false, error: "Please check the form and try again." },
        { status: 400 }
      );
    }

    console.error("[contact]", error);
    return NextResponse.json(
      {
        ok: false,
        error:
          "Could not send your message right now. Email us at info@hikaru-chess-elites.online.",
      },
      { status: 500 }
    );
  }
}
