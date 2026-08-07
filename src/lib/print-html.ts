import {
  getPrintCard,
  type PrintCardAudience,
  type PrintPhoto,
} from "@/lib/content";

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

const PRINT_CSS = `
@import url("https://fonts.googleapis.com/css2?family=Oxanium:wght@400;500;600;700&family=Source+Code+Pro:wght@400;500;600&display=swap");
*{box-sizing:border-box;margin:0;padding:0}
html,body{
  -webkit-print-color-adjust:exact!important;
  print-color-adjust:exact!important;
  color-adjust:exact!important;
  background:#111;
  color:#e8e8e8;
  font-family:Oxanium,sans-serif;
}
body{display:block!important;min-height:0!important;height:auto!important;overflow:visible!important}
.nav{
  position:sticky;top:0;z-index:20;display:flex;flex-wrap:wrap;gap:.75rem;align-items:center;
  padding:1rem 1.25rem;background:#1a1a1a;border-bottom:1px solid #5c5c5c;
  font-family:"Source Code Pro",monospace;font-size:11px;letter-spacing:.12em;text-transform:uppercase
}
.nav a{color:#6ba3d4;text-decoration:none}
.btn{
  display:inline-flex;align-items:center;padding:.55rem 1rem;border:1px solid #e23d2e;
  background:#e23d2e;color:#fff;font:inherit;letter-spacing:.14em;text-transform:uppercase;cursor:pointer;text-decoration:none
}
.hint{margin-left:auto;color:#a8a8a8;text-transform:none;letter-spacing:.06em}
.sheet{
  width:148mm;height:210mm;margin:1.5rem auto;position:relative;overflow:hidden;
  background:#2c2c2c;box-shadow:0 12px 40px rgba(0,0,0,.55);
  -webkit-print-color-adjust:exact!important;print-color-adjust:exact!important
}
.sheet-back{display:flex;flex-direction:column}
.photo{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.veil{position:absolute;inset:0;background:linear-gradient(to top,rgba(26,26,26,.97) 0%,rgba(26,26,26,.78) 32%,rgba(26,26,26,.25) 58%,rgba(26,26,26,.15) 100%)}
.grid{position:absolute;inset:0;opacity:.07;background-image:linear-gradient(to right,currentColor 1px,transparent 1px),linear-gradient(to bottom,currentColor 1px,transparent 1px);background-size:12.5% 12.5%}
.content{position:absolute;inset:0;display:flex;flex-direction:column;justify-content:flex-end;padding:8mm;z-index:2}
.eyebrow{font-family:"Source Code Pro",monospace;font-size:7pt;letter-spacing:.28em;text-transform:uppercase;color:#7cb342}
.eyebrow.muted{color:#a8a8a8}
.wordmark{margin-top:3mm;font-size:34pt;font-weight:600;letter-spacing:.08em;line-height:.9;text-transform:uppercase;color:#e8e8e8}
.sub{margin-top:1.5mm;font-size:8pt;letter-spacing:.35em;text-transform:uppercase;color:#a8a8a8}
.tag{margin-top:3.5mm;max-width:120mm;font-size:9pt;line-height:1.35;color:rgba(232,232,232,.92)}
.meta{margin-top:4mm;display:flex;flex-wrap:wrap;gap:2mm 5mm;font-family:"Source Code Pro",monospace;font-size:6.5pt;letter-spacing:.14em;text-transform:uppercase;color:#6ba3d4}
.inner{flex:1;display:flex;flex-direction:column;padding:8mm;min-height:0;background:#2c2c2c}
.head{border-bottom:1px solid #5c5c5c;padding-bottom:4mm}
.title{margin-top:2mm;font-size:15pt;font-weight:600;letter-spacing:.04em;line-height:1.15;color:#e8e8e8}
.lede{margin-top:2mm;max-width:130mm;font-size:8pt;line-height:1.4;color:#a8a8a8}
.pillars{display:grid;grid-template-columns:repeat(3,1fr);margin-top:4mm;border:1px solid #5c5c5c}
.pillar{padding:3.5mm 2.5mm;background:#3a3a3a;border-right:1px solid #5c5c5c;min-height:38mm}
.pillar:last-child{border-right:0}
.pillar.focus{background:#424242;box-shadow:inset 0 0 0 1.5px #e23d2e}
.plabel{font-family:"Source Code Pro",monospace;font-size:6pt;letter-spacing:.2em;text-transform:uppercase;color:#7cb342}
.ptitle{margin-top:1.5mm;font-size:9pt;font-weight:600;letter-spacing:.04em;color:#e8e8e8}
.pline{margin-top:1mm;font-size:7pt;color:#7cb342;line-height:1.3}
.pbody{margin-top:1.5mm;font-size:6.5pt;line-height:1.35;color:#a8a8a8}
.benefits{margin-top:4mm;list-style:none;display:grid;gap:1.5mm}
.benefits li{font-family:"Source Code Pro",monospace;font-size:6.5pt;letter-spacing:.04em;text-transform:uppercase;color:#a8a8a8;padding-left:3.5mm;position:relative}
.benefits li:before{content:"·";position:absolute;left:0;color:#e23d2e;font-weight:700}
.cta{margin-top:auto;padding-top:4mm;border-top:1px solid #5c5c5c;display:grid;grid-template-columns:1fr auto;gap:4mm;align-items:end}
.clabel{font-family:"Source Code Pro",monospace;font-size:6.5pt;letter-spacing:.2em;text-transform:uppercase;color:#e23d2e}
.ctitle{margin-top:1.5mm;font-size:10pt;font-weight:600;color:#e8e8e8}
.clinks{margin-top:2mm;font-size:7.5pt;line-height:1.5;color:#a8a8a8}
.clinks strong{color:#6ba3d4;font-weight:500}
.qr{width:18mm;height:18mm;border:1px solid #5c5c5c;background:#fff;padding:1mm;display:flex;align-items:center;justify-content:center}
.qr img{width:100%;height:100%;object-fit:contain}
.foot{margin-top:3mm;font-family:"Source Code Pro",monospace;font-size:5.5pt;letter-spacing:.14em;text-transform:uppercase;color:#5c5c5c}
@page{size:A5 portrait;margin:0}
@media print{
  .nav,.no-print{display:none!important}
  html,body{background:#2c2c2c!important}
  .sheet{margin:0;box-shadow:none;page-break-after:always;break-after:page}
  .sheet:last-child{page-break-after:auto;break-after:auto}
}
`;

type BuildArgs = {
  audience: PrintCardAudience;
  photo: PrintPhoto;
  origin: string;
  autoprint?: boolean;
};

export function buildPrintCardHtml({
  audience,
  photo,
  origin,
  autoprint = false,
}: BuildArgs) {
  const card = getPrintCard(audience);
  const qrSrc = `${origin}/print/assets/qr.png`;
  const objectPosition = escapeHtml(photo.objectPosition);
  const photoSrc = escapeHtml(photo.src);

  const pillars = card.pillars
    .map((pillar) => {
      const focusClass = pillar.focus ? " focus" : "";
      return `<section class="pillar${focusClass}">
  <p class="plabel">${escapeHtml(pillar.label)}</p>
  <h3 class="ptitle">${escapeHtml(pillar.title)}</h3>
  <p class="pline">${escapeHtml(pillar.line)}</p>
  <p class="pbody">${escapeHtml(pillar.body)}</p>
</section>`;
    })
    .join("");

  const benefits = card.benefits
    .map((item) => `<li>${escapeHtml(item)}</li>`)
    .join("");

  const photoQ =
    photo.id === "custom"
      ? `img=${encodeURIComponent(photo.src)}`
      : `photo=${encodeURIComponent(photo.id)}`;

  const pdfHref = `${escapeHtml(origin)}/api/print-pdf?audience=${encodeURIComponent(audience)}&${photoQ}`;

  const autoScript = autoprint
    ? `<script>location.replace(${JSON.stringify(`${origin}/api/print-pdf?audience=${audience}&${photoQ}`)});</script>`
    : `<script>
document.getElementById('print-btn')?.addEventListener('click', function(){
  location.href = ${JSON.stringify(`${origin}/api/print-pdf?audience=${audience}&${photoQ}`)};
});
</script>`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<title>A5 Card · ${escapeHtml(card.title)} · Hikaru Chess Elites</title>
<style>${PRINT_CSS}</style>
</head>
<body>
<nav class="nav no-print">
  <a href="${escapeHtml(origin)}/resources">← Resources</a>
  <a href="?audience=parents&${photoQ}">Parents</a>
  <a href="?audience=kids&${photoQ}">Kids</a>
  <a href="?audience=schools&${photoQ}">Schools</a>
  <a href="?audience=coaching&${photoQ}">Coaching</a>
  <a href="?audience=events&${photoQ}">Events</a>
  <a class="btn" id="print-btn" href="${pdfHref}">Download card PDF</a>
  <span class="hint">A5 · front + back · ${escapeHtml(photo.label)}</span>
</nav>

<article class="sheet" aria-label="${escapeHtml(card.title)} card front">
  <img class="photo" src="${photoSrc}" alt="${escapeHtml(photo.alt)}" style="object-position:${objectPosition}"/>
  <div class="veil" aria-hidden="true"></div>
  <div class="grid" aria-hidden="true"></div>
  <div class="content">
    <p class="eyebrow">${escapeHtml(card.eyebrow)}</p>
    <h1 class="wordmark">Hikaru</h1>
    <p class="sub">Chess Elites</p>
    <p class="tag">${escapeHtml(card.tagline)}</p>
    <p class="meta"><span>hikaru-chess-elites.online</span><span>${escapeHtml(card.frontMeta)}</span></p>
  </div>
</article>

<article class="sheet sheet-back" aria-label="${escapeHtml(card.title)} card back">
  <div class="inner">
    <header class="head">
      <p class="eyebrow muted">${escapeHtml(card.backEyebrow)}</p>
      <h2 class="title">${escapeHtml(card.backTitle)}</h2>
      <p class="lede">${escapeHtml(card.backLede)}</p>
    </header>
    <div class="pillars">${pillars}</div>
    <ul class="benefits">${benefits}</ul>
    <div class="cta">
      <div>
        <p class="clabel">Next step</p>
        <p class="ctitle">${escapeHtml(card.ctaTitle)}</p>
        <div class="clinks">
          <div><strong>hikaru-chess-elites.online</strong></div>
          <div>info@hikaru-chess-elites.online</div>
        </div>
      </div>
      <div class="qr"><img src="${escapeHtml(qrSrc)}" alt="QR code"/></div>
    </div>
    <p class="foot">Hikaru Chess Elites · We train minds. In schools. At the board.</p>
  </div>
</article>
${autoScript}
</body>
</html>`;
}
