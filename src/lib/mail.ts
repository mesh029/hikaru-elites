import { readFileSync } from "fs";
import path from "path";
import nodemailer, { type SentMessageInfo, type Transporter } from "nodemailer";
import { EMAIL_LOGO_CID } from "@/lib/email-templates";

export const SENDER_OPTIONS = [
  {
    id: "info",
    label: "info@hikaru-chess-elites.online",
    address: "info@hikaru-chess-elites.online",
    displayName: "Hikaru Elites",
  },
  {
    id: "hello",
    label: "hello@hikaru-chess-elites.online",
    address: "hello@hikaru-chess-elites.online",
    displayName: "Hikaru Chess Elites",
  },
  {
    id: "support",
    label: "support@hikaru-chess-elites.online",
    address: "support@hikaru-chess-elites.online",
    displayName: "Hikaru Support",
  },
] as const;

export type SenderId = (typeof SENDER_OPTIONS)[number]["id"];

function required(name: string) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }
  return value;
}

export function getMailer() {
  const port = Number(process.env.ZOHO_SMTP_PORT || "465");

  return nodemailer.createTransport({
    host: process.env.ZOHO_SMTP_HOST || "smtp.zoho.com",
    port,
    secure: port === 465,
    auth: {
      user: required("ZOHO_SMTP_USER"),
      pass: required("ZOHO_SMTP_PASS"),
    },
  });
}

export function brandFromName(fromId?: string) {
  const desk = fromId ? resolveSender(fromId) : null;
  if (desk && "displayName" in desk && desk.displayName) {
    return desk.displayName;
  }
  return process.env.CONTACT_FROM_NAME || "Hikaru Chess Elites";
}

export function resolveSender(fromId?: string) {
  const match = SENDER_OPTIONS.find((option) => option.id === fromId);
  if (match) return match;

  const fallback =
    process.env.CONTACT_FROM || "info@hikaru-chess-elites.online";
  return {
    id: "custom" as const,
    label: fallback,
    address: fallback,
    displayName: process.env.CONTACT_FROM_NAME || "Hikaru Chess Elites",
  };
}

export function contactRecipients() {
  const raw =
    process.env.CONTACT_TO ||
    "info@hikaru-chess-elites.online,hello@hikaru-chess-elites.online,support@hikaru-chess-elites.online";
  return raw
    .split(",")
    .map((email) => email.trim())
    .filter(Boolean);
}

export function adminPassphrase() {
  return process.env.ADMIN_PASSPHRASE || "lcwaikiki";
}

export function assertAdminPassphrase(value: string | null | undefined) {
  if (!value || value !== adminPassphrase()) {
    const error = new Error("Unauthorized");
    error.name = "AuthError";
    throw error;
  }
}

export async function verifyMailer() {
  const mailer = getMailer();
  await mailer.verify();
  return true;
}

function isSenderRejected(error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  return (
    message.includes("553") ||
    message.toLowerCase().includes("sender is not allowed")
  );
}

function emailLogoAttachment() {
  const filename = path.join(process.cwd(), "public", "brand", "email-logo.png");
  return {
    filename: "hikaru-logo.png",
    content: readFileSync(filename),
    cid: EMAIL_LOGO_CID,
    contentType: "image/png",
    contentDisposition: "inline" as const,
  };
}

type SendArgs = {
  mailer?: Transporter;
  fromId: SenderId;
  to: string | string[];
  subject: string;
  text: string;
  html: string;
  replyTo?: string;
};

export async function sendThemedMail({
  mailer = getMailer(),
  fromId,
  to,
  subject,
  text,
  html,
  replyTo,
}: SendArgs): Promise<{ info: SentMessageInfo; from: string; usedFallback: boolean }> {
  const desk = resolveSender(fromId);
  const brand = brandFromName(fromId);
  const smtpUser = required("ZOHO_SMTP_USER");
  const sendAsEnabled = process.env.ZOHO_SEND_AS === "true";
  const attachments = [emailLogoAttachment()];

  const sendWith = async (address: string) =>
    mailer.sendMail({
      from: `"${brand}" <${address}>`,
      to,
      replyTo: replyTo || desk.address,
      subject,
      text,
      html,
      attachments,
    });

  if (sendAsEnabled) {
    try {
      const info = await sendWith(desk.address);
      return { info, from: desk.address, usedFallback: false };
    } catch (error) {
      if (!isSenderRejected(error)) throw error;
    }
  }

  const info = await sendWith(smtpUser);
  return {
    info,
    from: smtpUser,
    usedFallback: smtpUser !== desk.address,
  };
}
