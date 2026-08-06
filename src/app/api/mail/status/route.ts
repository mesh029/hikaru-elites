import { NextResponse } from "next/server";

import { verifyMailer, SENDER_OPTIONS } from "@/lib/mail";

export async function GET() {
  try {
    await verifyMailer();
    return NextResponse.json({
      ok: true,
      smtp: "verified",
      senders: SENDER_OPTIONS.map((s) => s.address),
      endpoints: [
        "POST /api/contact",
        "POST /api/admin/send",
        "GET /api/mail/status",
      ],
    });
  } catch (error) {
    console.error("[mail/status]", error);
    return NextResponse.json(
      {
        ok: false,
        smtp: "failed",
        error: error instanceof Error ? error.message : "SMTP verify failed",
      },
      { status: 500 }
    );
  }
}
