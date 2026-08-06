import { NextResponse } from "next/server";
import { z } from "zod";

import { adminBroadcastEmail } from "@/lib/email-templates";
import {
  assertAdminPassphrase,
  resolveSender,
  sendThemedMail,
  SENDER_OPTIONS,
} from "@/lib/mail";

const sendSchema = z.object({
  passphrase: z.string().min(1),
  from: z.enum(["info", "hello", "support"]),
  to: z.string().trim().email().max(200),
  subject: z.string().trim().min(2).max(200),
  body: z.string().trim().min(2).max(8000),
});

export async function POST(request: Request) {
  try {
    const json = await request.json();

    if (
      !json ||
      typeof json !== "object" ||
      !("passphrase" in json) ||
      typeof (json as { passphrase?: unknown }).passphrase !== "string"
    ) {
      return NextResponse.json(
        { ok: false, error: "Wrong passphrase." },
        { status: 401 }
      );
    }

    assertAdminPassphrase((json as { passphrase: string }).passphrase);

    const data = sendSchema.parse(json);
    const desk = resolveSender(data.from).address;
    const html = adminBroadcastEmail({
      subject: data.subject,
      body: data.body,
      desk,
    });

    const result = await sendThemedMail({
      fromId: data.from,
      to: data.to,
      subject: data.subject,
      text: data.body,
      html,
    });

    return NextResponse.json({
      ok: true,
      from: result.from,
      desk,
      to: data.to,
      usedFallback: result.usedFallback,
      messageId: result.info.messageId,
    });
  } catch (error) {
    if (error instanceof Error && error.name === "AuthError") {
      return NextResponse.json(
        { ok: false, error: "Wrong passphrase." },
        { status: 401 }
      );
    }

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { ok: false, error: "Invalid admin send payload." },
        { status: 400 }
      );
    }

    console.error("[admin/send]", error);
    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "Could not send email right now.",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    ok: true,
    senders: SENDER_OPTIONS,
    usage:
      "POST { passphrase, from: 'info'|'hello'|'support', to, subject, body }",
  });
}
