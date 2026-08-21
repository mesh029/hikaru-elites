import {
  getPrintCard,
  type PrintCardAudience,
  type PrintPhoto,
} from "@/lib/content";
import {
  DEFAULT_PRINT_THEME,
  printThemeCssVars,
  type PrintTheme,
} from "@/lib/print-theme";

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
  background:var(--print-page-bg);
  color:var(--print-fg);
  font-family:Oxanium,sans-serif;
  overflow-x:hidden;
}
body{display:block!important;min-height:0!important;height:auto!important;overflow-x:hidden!important}
.nav{
  position:sticky;top:0;z-index:20;display:flex;flex-direction:column;gap:.75rem;
  padding:.85rem 1rem;background:var(--print-nav-bg);border-bottom:1px solid var(--print-border);
  font-family:"Source Code Pro",monospace;font-size:11px;letter-spacing:.12em;text-transform:uppercase
}
.nav-row{display:flex;flex-wrap:wrap;gap:.55rem .75rem;align-items:center}
.nav-audiences{flex-wrap:nowrap;overflow-x:auto;-webkit-overflow-scrolling:touch;scrollbar-width:thin;padding-bottom:.15rem}
.nav-audiences a{flex:0 0 auto}
.nav a{color:var(--print-accent);text-decoration:none}
.btn{
  display:inline-flex;align-items:center;justify-content:center;padding:.55rem 1rem;border:1px solid var(--print-primary);
  background:var(--print-primary);color:#fff;font:inherit;letter-spacing:.14em;text-transform:uppercase;cursor:pointer;text-decoration:none
}
.btn-secondary{
  display:inline-flex;align-items:center;justify-content:center;padding:.55rem 1rem;border:1px solid var(--print-border);
  background:transparent;color:var(--print-fg);font:inherit;letter-spacing:.14em;text-transform:uppercase;text-decoration:none
}
.theme-toggle{display:inline-flex;border:1px solid var(--print-border);overflow:hidden}
.theme-toggle a{
  padding:.45rem .7rem;color:var(--print-muted);text-decoration:none;border-right:1px solid var(--print-border)
}
.theme-toggle a:last-child{border-right:0}
.theme-toggle a.is-active{background:var(--print-primary);color:#fff}
.hint{color:var(--print-muted);text-transform:none;letter-spacing:.06em}
.stage{
  width:100%;max-width:100%;box-sizing:border-box;padding:1rem;display:flex;flex-direction:column;
  align-items:center;gap:1.25rem;overflow-x:hidden
}
.sheet-frame{
  width:min(148mm,calc(100vw - 2rem));max-width:100%;aspect-ratio:148/210;container-type:inline-size;container-name:print-sheet;
  position:relative;margin:0;overflow:hidden
}
.sheet{
  width:148mm;height:210mm;margin:0;position:absolute;top:0;left:0;overflow:hidden;
  background:var(--print-bg);box-shadow:0 12px 40px rgba(0,0,0,.55);
  transform-origin:top left;transform:scale(calc(100cqw / 148mm));
  -webkit-print-color-adjust:exact!important;print-color-adjust:exact!important
}
.sheet-back{display:flex;flex-direction:column}
.photo{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.veil{position:absolute;inset:0;background:var(--print-veil)}
.grid{position:absolute;inset:0;opacity:.07;background-image:linear-gradient(to right,currentColor 1px,transparent 1px),linear-gradient(to bottom,currentColor 1px,transparent 1px);background-size:12.5% 12.5%}
.content{position:absolute;inset:0;display:flex;flex-direction:column;justify-content:flex-end;padding:8mm;z-index:2}
.eyebrow{font-family:"Source Code Pro",monospace;font-size:7pt;letter-spacing:.28em;text-transform:uppercase;color:var(--print-secondary)}
.eyebrow.muted{color:var(--print-muted)}
.wordmark{margin-top:3mm;font-size:34pt;font-weight:600;letter-spacing:.08em;line-height:.9;text-transform:uppercase;color:var(--print-fg)}
.sub{margin-top:1.5mm;font-size:8pt;letter-spacing:.35em;text-transform:uppercase;color:var(--print-muted)}
.tag{margin-top:3.5mm;max-width:120mm;font-size:9pt;line-height:1.35;color:var(--print-tag)}
.meta{margin-top:4mm;display:flex;flex-wrap:wrap;gap:2mm 5mm;font-family:"Source Code Pro",monospace;font-size:6.5pt;letter-spacing:.14em;text-transform:uppercase;color:var(--print-accent)}
.inner{flex:1;display:flex;flex-direction:column;padding:8mm;min-height:0;background:var(--print-bg)}
.head{border-bottom:1px solid var(--print-border);padding-bottom:4mm}
.title{margin-top:2mm;font-size:15pt;font-weight:600;letter-spacing:.04em;line-height:1.15;color:var(--print-fg)}
.lede{margin-top:2mm;max-width:130mm;font-size:8pt;line-height:1.4;color:var(--print-muted)}
.pillars{display:grid;grid-template-columns:repeat(3,1fr);margin-top:4mm;border:1px solid var(--print-border)}
.pillar{padding:3.5mm 2.5mm;background:var(--print-card);border-right:1px solid var(--print-border);min-height:38mm}
.pillar:last-child{border-right:0}
.pillar.focus{background:var(--print-focus-card);box-shadow:inset 0 0 0 1.5px var(--print-primary)}
.plabel{font-family:"Source Code Pro",monospace;font-size:6pt;letter-spacing:.2em;text-transform:uppercase;color:var(--print-secondary)}
.ptitle{margin-top:1.5mm;font-size:9pt;font-weight:600;letter-spacing:.04em;color:var(--print-fg)}
.pline{margin-top:1mm;font-size:7pt;color:var(--print-secondary);line-height:1.3}
.pbody{margin-top:1.5mm;font-size:6.5pt;line-height:1.35;color:var(--print-muted)}
.benefits{margin-top:4mm;list-style:none;display:grid;gap:1.5mm}
.benefits li{font-family:"Source Code Pro",monospace;font-size:6.5pt;letter-spacing:.04em;text-transform:uppercase;color:var(--print-muted);padding-left:3.5mm;position:relative}
.benefits li:before{content:"·";position:absolute;left:0;color:var(--print-primary);font-weight:700}
.cta{margin-top:auto;padding-top:4mm;border-top:1px solid var(--print-border);display:grid;grid-template-columns:1fr auto;gap:4mm;align-items:end}
.clabel{font-family:"Source Code Pro",monospace;font-size:6.5pt;letter-spacing:.2em;text-transform:uppercase;color:var(--print-primary)}
.ctitle{margin-top:1.5mm;font-size:10pt;font-weight:600;color:var(--print-fg)}
.clinks{margin-top:2mm;font-size:7.5pt;line-height:1.5;color:var(--print-muted)}
.clinks strong{color:var(--print-accent);font-weight:500}
.qr{width:18mm;height:18mm;border:1px solid var(--print-border);background:#fff;padding:1mm;display:flex;align-items:center;justify-content:center}
.qr img{width:100%;height:100%;object-fit:contain}
.foot{margin-top:3mm;font-family:"Source Code Pro",monospace;font-size:5.5pt;letter-spacing:.14em;text-transform:uppercase;color:var(--print-foot)}
@page{size:A5 portrait;margin:0}
@media print{
  .nav,.no-print{display:none!important}
  html,body{background:var(--print-bg)!important;overflow:visible!important}
  .stage{padding:0!important;gap:0!important;display:block!important}
  .sheet-frame{width:148mm!important;max-width:none!important;height:210mm!important;aspect-ratio:auto!important;margin:0!important;overflow:visible!important}
  .sheet{
    position:relative!important;top:auto!important;left:auto!important;width:148mm!important;height:210mm!important;
    margin:0;box-shadow:none;transform:none!important;page-break-after:always;break-after:page
  }
  .sheet:last-child{page-break-after:auto;break-after:auto}
}
`;

type BuildArgs = {
  audience: PrintCardAudience;
  photo: PrintPhoto;
  origin: string;
  theme?: PrintTheme;
  autoprint?: boolean;
};

export function buildPrintCardHtml({
  audience,
  photo,
  origin,
  theme = DEFAULT_PRINT_THEME,
  autoprint = false,
}: BuildArgs) {
  const card = getPrintCard(audience);
  const qrSrc = `${origin}/print/assets/qr.png`;
  const objectPosition = escapeHtml(photo.objectPosition);
  const photoSrc = escapeHtml(photo.src);
  const themeVars = printThemeCssVars(theme);

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
  const themeQ = `theme=${theme}`;
  const queryBase = `${photoQ}&${themeQ}`;

  const pdfHref = `${escapeHtml(origin)}/api/print-pdf?audience=${encodeURIComponent(audience)}&${queryBase}`;

  const autoScript = autoprint
    ? `<script>location.replace(${JSON.stringify(`${origin}/api/print-pdf?audience=${audience}&${queryBase}`)});</script>`
    : `<script>
document.getElementById('print-btn')?.addEventListener('click', function(){
  location.href = ${JSON.stringify(`${origin}/api/print-pdf?audience=${audience}&${queryBase}`)};
});
</script>`;

  const darkHref = `?audience=${encodeURIComponent(audience)}&${photoQ}&theme=dark`;
  const lightHref = `?audience=${encodeURIComponent(audience)}&${photoQ}&theme=light`;

  return `<!DOCTYPE html>
<html lang="en" data-print-theme="${theme}">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<title>A5 Card · ${escapeHtml(card.title)} · Hikaru Chess Elites</title>
<style>:root{${themeVars}}${PRINT_CSS}</style>
</head>
<body>
<nav class="nav no-print">
  <div class="nav-row">
    <a href="${escapeHtml(origin)}/resources">← Resources</a>
    <span class="theme-toggle" aria-label="Print theme">
      <a class="${theme === "dark" ? "is-active" : ""}" href="${darkHref}">Dark</a>
      <a class="${theme === "light" ? "is-active" : ""}" href="${lightHref}">Light</a>
    </span>
    <span class="hint">A5 · ${escapeHtml(photo.label)} · ${theme}</span>
  </div>
  <div class="nav-row nav-audiences">
    <a href="?audience=parents&${queryBase}">Parents</a>
    <a href="?audience=kids&${queryBase}">Kids</a>
    <a href="?audience=schools&${queryBase}">Schools</a>
    <a href="?audience=coaching&${queryBase}">Coaching</a>
    <a href="?audience=events&${queryBase}">Events</a>
  </div>
  <div class="nav-row">
    <a class="btn" id="print-btn" href="${pdfHref}">Download card PDF</a>
  </div>
</nav>

<div class="stage">
<div class="sheet-frame">
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
</div>

<div class="sheet-frame">
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
</div>
</div>
${autoScript}
</body>
</html>`;
}
