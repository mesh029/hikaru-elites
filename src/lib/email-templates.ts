const colors = {
  bg: "#F4F2EF",
  paper: "#FBFAF8",
  text: "#2F2C2A",
  muted: "#6F6A66",
  soft: "#8A847E",
  line: "#E4DFD8",
  accent: "#B55248",
  accentSoft: "#C97870",
  link: "#3D6E8C",
};

export const EMAIL_LOGO_CID = "hikaru-logo";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://hikaru-chess-elites.online";

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function paragraphsFromText(text: string) {
  return escapeHtml(text)
    .split(/\n{2,}/)
    .map((block) => {
      const html = block.replaceAll("\n", "<br />");
      return `<p style="margin:0 0 14px;font-size:16px;line-height:1.7;color:${colors.text};">${html}</p>`;
    })
    .join("");
}

function infoLine(label: string, value: string) {
  return `
    <p style="margin:0 0 12px;font-size:15px;line-height:1.6;color:${colors.text};">
      <span style="display:inline-block;min-width:78px;color:${colors.soft};">${escapeHtml(label)}</span>
      ${value}
    </p>`;
}

type ShellOptions = {
  preheader?: string;
  title: string;
  bodyHtml: string;
  footerNote?: string;
};

export function hikaruEmailShell({
  preheader = "",
  title,
  bodyHtml,
  footerNote = "Kids training · School programs · Personal coaching across Kenya.",
}: ShellOptions) {
  const safeTitle = escapeHtml(title);
  const safeFooter = escapeHtml(footerNote);
  const safePreheader = escapeHtml(preheader);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${safeTitle}</title>
</head>
<body style="margin:0;padding:0;background:${colors.bg};color:${colors.text};">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${safePreheader}</div>
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:${colors.bg};">
    <tr>
      <td align="center" style="padding:36px 16px;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:580px;background:${colors.paper};">
          <tr>
            <td style="padding:32px 32px 8px;font-family:Georgia,'Times New Roman',serif;">
              <img src="cid:${EMAIL_LOGO_CID}" width="44" height="44" alt="Hikaru Chess Elites" style="display:block;border:0;border-radius:12px;" />
              <p style="margin:16px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:13px;letter-spacing:0.08em;text-transform:uppercase;color:${colors.accentSoft};">Hikaru Chess Elites</p>
              <h1 style="margin:8px 0 0;font-size:28px;line-height:1.25;font-weight:normal;color:${colors.text};">${safeTitle}</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:20px 32px 8px;font-family:Arial,Helvetica,sans-serif;">
              ${bodyHtml}
            </td>
          </tr>
          <tr>
            <td style="padding:24px 32px 36px;font-family:Arial,Helvetica,sans-serif;">
              <p style="margin:0 0 10px;font-size:14px;line-height:1.6;color:${colors.muted};">${safeFooter}</p>
              <p style="margin:0 0 6px;font-size:14px;line-height:1.7;color:${colors.muted};">
                <a href="${siteUrl}" style="color:${colors.link};text-decoration:none;">hikaru-chess-elites.online</a>
                &nbsp;·&nbsp;
                <a href="mailto:info@hikaru-chess-elites.online" style="color:${colors.link};text-decoration:none;">info@hikaru-chess-elites.online</a>
              </p>
              <p style="margin:0;font-size:13px;line-height:1.6;color:${colors.soft};">
                hello@ · support@ available if you need another desk
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export function inquiryConfirmationEmail(input: {
  name: string;
  interest: string;
  message: string;
}) {
  const name = escapeHtml(input.name);
  const interest = escapeHtml(input.interest);
  const message = escapeHtml(input.message).replaceAll("\n", "<br />");

  const bodyHtml = `
    <p style="margin:0 0 16px;font-size:16px;line-height:1.7;color:${colors.text};">Hi ${name},</p>
    <p style="margin:0 0 16px;font-size:16px;line-height:1.7;color:${colors.text};">
      Thanks for writing to Hikaru Chess Elites. We have your note and will reply soon, usually within one to two business days.
    </p>
    <p style="margin:0 0 6px;font-size:13px;letter-spacing:0.04em;text-transform:uppercase;color:${colors.soft};">What you sent</p>
    ${infoLine("Interest", interest)}
    <p style="margin:0 0 18px;font-size:15px;line-height:1.7;color:${colors.text};">${message}</p>

    <p style="margin:0 0 8px;font-size:13px;letter-spacing:0.04em;text-transform:uppercase;color:${colors.soft};">What happens next</p>
    <p style="margin:0 0 10px;font-size:15px;line-height:1.7;color:${colors.text};">1. We read your message and match it to the right coach or program lead.</p>
    <p style="margin:0 0 10px;font-size:15px;line-height:1.7;color:${colors.text};">2. You get a personal reply with next steps, timing, and any questions we still need.</p>
    <p style="margin:0 0 18px;font-size:15px;line-height:1.7;color:${colors.text};">3. If it is a fit, we book a session, school visit, or coaching plan.</p>

    <p style="margin:0 0 8px;font-size:13px;letter-spacing:0.04em;text-transform:uppercase;color:${colors.soft};">Ways we train</p>
    <p style="margin:0 0 8px;font-size:15px;line-height:1.7;color:${colors.text};"><strong style="font-weight:600;color:${colors.text};">Kids</strong> — age-ready lessons that build focus without killing the fun.</p>
    <p style="margin:0 0 8px;font-size:15px;line-height:1.7;color:${colors.text};"><strong style="font-weight:600;color:${colors.text};">Schools</strong> — clubs and term programs that fit real timetables.</p>
    <p style="margin:0 0 18px;font-size:15px;line-height:1.7;color:${colors.text};"><strong style="font-weight:600;color:${colors.text};">Coaching</strong> — one-to-one or small groups for anyone ready to improve.</p>

    <p style="margin:0 0 16px;font-size:15px;line-height:1.7;color:${colors.muted};">
      Browse programs anytime at
      <a href="${siteUrl}/programs" style="color:${colors.link};text-decoration:none;">${siteUrl.replace(/^https?:\/\//, "")}/programs</a>.
      Need something faster? Just reply to this email.
    </p>
    <p style="margin:0;font-size:16px;line-height:1.7;color:${colors.text};">See you at the board.</p>
  `;

  return hikaruEmailShell({
    preheader: "We received your inquiry and will get back to you soon.",
    title: "We got your message",
    bodyHtml,
  });
}

export function inquiryTeamEmail(input: {
  name: string;
  email: string;
  phone?: string;
  interest: string;
  message: string;
}) {
  const emailLink = `<a href="mailto:${escapeHtml(input.email)}" style="color:${colors.link};text-decoration:none;">${escapeHtml(input.email)}</a>`;
  const phone = escapeHtml(input.phone?.trim() || "not provided");
  const message = escapeHtml(input.message).replaceAll("\n", "<br />");

  const bodyHtml = `
    <p style="margin:0 0 18px;font-size:16px;line-height:1.7;color:${colors.text};">
      New inquiry from the website contact form.
    </p>
    ${infoLine("Name", escapeHtml(input.name))}
    ${infoLine("Email", emailLink)}
    ${infoLine("Phone", phone)}
    ${infoLine("Interest", escapeHtml(input.interest))}
    <p style="margin:18px 0 6px;font-size:13px;letter-spacing:0.04em;text-transform:uppercase;color:${colors.soft};">Message</p>
    <p style="margin:0;font-size:15px;line-height:1.7;color:${colors.text};">${message}</p>
  `;

  return hikaruEmailShell({
    preheader: `New ${input.interest} inquiry from ${input.name}`,
    title: "New website inquiry",
    bodyHtml,
    footerNote: "Reply from this thread so the visitor stays in the same conversation.",
  });
}

export function adminBroadcastEmail(input: {
  subject: string;
  body: string;
  desk?: string;
}) {
  const deskLine = input.desk
    ? `<p style="margin:0 0 16px;font-size:14px;line-height:1.6;color:${colors.muted};">From · ${escapeHtml(input.desk)}</p>`
    : "";

  return hikaruEmailShell({
    preheader: input.subject,
    title: input.subject,
    bodyHtml: `${deskLine}${paragraphsFromText(input.body)}`,
  });
}

export { escapeHtml, paragraphsFromText };
