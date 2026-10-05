// templates.mjs
// -----------------------------------------------------------------------------
// Pure rendering. No dates, no state logic, no content literals: everything
// comes in as arguments. Dark-first ROOTLIGHT surface (the night ritual as the
// inverse of the light press site), same palette and seal family.
// -----------------------------------------------------------------------------

const esc = (s) => String(s == null ? "" : s)
  .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
  .replace(/"/g, "&quot;");

// A compact version of the Amberroot seal (rings, tree, waterline, mirrored
// roots, amber taproot and seed-point). The production site reuses the full
// colophon; this is sized for cards and headers.
export function seal(cls = "seal") {
  return `<svg class="${cls}" viewBox="0 0 120 120" role="img" aria-label="The Amberroot seal: a tree above the waterline, its roots mirrored below, one amber light at the deepest root.">
  <defs>
    <radialGradient id="tn-glow" cx="60" cy="104" r="20" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#C28A2E" stop-opacity="0.6"/>
      <stop offset="1" stop-color="#C28A2E" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="tn-tap" x1="0" y1="60" x2="0" y2="104" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#847A6A"/><stop offset="1" stop-color="#C28A2E"/>
    </linearGradient>
  </defs>
  <circle cx="60" cy="60" r="55" fill="none" stroke="currentColor" stroke-width="1"/>
  <circle cx="60" cy="60" r="51" fill="none" stroke="currentColor" stroke-width="0.6"/>
  <line x1="10" y1="60" x2="110" y2="60" stroke="currentColor" stroke-width="0.8"/>
  <circle cx="60" cy="104" r="20" fill="url(#tn-glow)"/>
  <path d="M34 60 Q60 48 86 60 Z" fill="currentColor"/>
  <g fill="none" stroke="currentColor" stroke-width="0.9" stroke-linecap="round">
    <path d="M60 54 V34 M60 44 L50 33 M60 44 L70 33 M50 33 L45 25 M50 33 L53 24 M70 33 L75 25 M70 33 L67 24 M60 38 L60 26"/>
  </g>
  <g fill="none" stroke="currentColor" stroke-width="0.7" stroke-linecap="round">
    <path d="M60 60 L48 80 M60 60 L72 80 M48 80 L40 94 M48 80 L54 95 M72 80 L80 94 M72 80 L66 95 M40 94 L36 101 M80 94 L84 101"/>
  </g>
  <path d="M60 60 L60 102" stroke="url(#tn-tap)" stroke-width="1" fill="none" stroke-linecap="round"/>
  <circle cx="60" cy="103" r="1.6" fill="#C28A2E"/>
</svg>`;
}

export function waterline() {
  return `<div class="waterline" role="separator" aria-hidden="true">
    <span class="line"></span>
    <svg width="20" height="26" viewBox="0 0 20 26" aria-hidden="true">
      <line x1="10" y1="0" x2="10" y2="10" stroke="#847A6A" stroke-width="1"/>
      <line x1="10" y1="16" x2="10" y2="26" stroke="#847A6A" stroke-width="1"/>
      <circle cx="10" cy="13" r="2" fill="#C28A2E"/>
    </svg>
    <span class="line"></span>
  </div>`;
}

export function layout({ title, description, body, bodyClass = "" }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="dark">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Albert+Sans:wght@300;400;500&family=Libre+Caslon+Display&family=Libre+Caslon+Text:ital@0;1&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/style.css">
</head>
<body class="${bodyClass}">
${body}
</body>
</html>`;
}

// The shared stylesheet, written once to dist/style.css.
export const CSS = `
:root{
  color-scheme: dark only;
  --bedrock:#171310; --loam:#241C13; --bone:#EDE5D2; --tallow:#E3D7BD;
  --amber:#C28A2E; --taupe:#847A6A; --frost:#C5D2D8; --radius:4px;
  --ease:cubic-bezier(.4,0,.2,1);
}
*,*::before,*::after{box-sizing:border-box}
html{background:var(--bedrock)}
body{margin:0;background:var(--bedrock);color:var(--bone);
  font-family:"Libre Caslon Text",Georgia,serif;font-size:1.0625rem;line-height:1.7}
@media(min-width:720px){body{font-size:1.125rem}}
h1,h2,h3{font-family:"Libre Caslon Display",Georgia,serif;font-weight:400;line-height:1.15;margin:0}
p{margin:0 0 1.1rem;max-width:34rem}
a{color:var(--amber);text-decoration:none;border-bottom:1px solid rgba(194,138,46,.4);
  transition:color .24s var(--ease),border-color .24s var(--ease)}
a:hover{color:var(--bone);border-color:var(--bone)}
:focus-visible{outline:2px solid var(--frost);outline-offset:3px;border-radius:2px}
.wrap{width:100%;max-width:62rem;margin:0 auto;padding:0 1.5rem}
.narrow{max-width:40rem}
.seal{display:block;color:var(--bone)}
.eyebrow{font-family:"Albert Sans",system-ui,sans-serif;font-weight:500;font-size:.72rem;
  letter-spacing:.24em;text-transform:uppercase;color:var(--taupe);margin:0 0 1rem}
.meta{font-family:"Albert Sans",system-ui,sans-serif;font-weight:400;font-size:.8rem;
  letter-spacing:.06em;color:var(--taupe)}
.waterline{display:flex;align-items:center;max-width:62rem;margin:2.5rem auto;padding:0 1.5rem;color:var(--taupe)}
.waterline .line{flex:1;height:1px;background:currentColor;opacity:.6}
.waterline svg{flex:0 0 auto;display:block}

/* ---- site header / masthead ---- */
.masthead{text-align:center;padding:3.5rem 0 1rem}
.masthead .seal{width:92px;height:92px;margin:0 auto 1.25rem}
.masthead h1{font-family:"Libre Caslon Display",serif;text-transform:uppercase;
  letter-spacing:.22em;font-size:clamp(1.4rem,5vw,2.2rem)}
.masthead .tagline{font-family:"Albert Sans",sans-serif;font-weight:300;color:var(--taupe);
  letter-spacing:.04em;font-size:.95rem;margin-top:.9rem}

/* ---- hub grid of doors ---- */
.doors{display:grid;grid-template-columns:repeat(4,1fr);gap:1rem;margin:2rem 0 1rem}
@media(max-width:860px){.doors{grid-template-columns:repeat(3,1fr)}}
@media(max-width:620px){.doors{grid-template-columns:repeat(2,1fr)}}
@media(max-width:380px){.doors{grid-template-columns:1fr}}
.door{position:relative;background:var(--loam);border:1px solid rgba(237,229,210,.1);
  border-radius:var(--radius);padding:1.25rem 1rem;min-height:9.5rem;display:flex;
  flex-direction:column;align-items:center;text-align:center;justify-content:center;
  color:var(--bone);border-bottom:none;transition:border-color .24s var(--ease)}
.door .seal{width:40px;height:40px;margin-bottom:.6rem;color:var(--taupe)}
.door .num{font-family:"Albert Sans",sans-serif;font-weight:500;font-size:.68rem;
  letter-spacing:.18em;text-transform:uppercase;color:var(--taupe)}
.door .face{font-family:"Libre Caslon Text",serif;font-style:italic;font-size:1.15rem;margin-top:.3rem}
.door .opens{font-family:"Albert Sans",sans-serif;font-size:.74rem;letter-spacing:.04em;
  color:var(--taupe);margin-top:.4rem}
a.door.open{border:1px solid rgba(194,138,46,.35)}
a.door.open:hover{border-color:var(--amber)}
a.door.open .seal{color:var(--amber)}
.door.locked{opacity:.78}
.door.locked .seal{opacity:.5}

/* ---- observance page ---- */
.obv{padding:2.5rem 0 1rem}
.obv .seal{width:84px;height:84px;margin:0 auto 1.25rem;color:var(--amber)}
.obv h1{text-align:center;font-size:clamp(1.8rem,5vw,2.6rem)}
.obv .num{text-align:center;display:block;margin-bottom:.6rem}
.obv .chronicler{font-style:italic;font-size:1.3rem;line-height:1.5;text-align:center;
  max-width:36rem;margin:1.6rem auto 2rem;color:var(--tallow)}
.slot{max-width:36rem;margin:0 auto 2rem}
.slot h2{font-family:"Albert Sans",sans-serif;font-weight:500;font-size:.72rem;letter-spacing:.24em;
  text-transform:uppercase;color:var(--taupe);margin:0 0 .6rem}
.artifact{background:var(--loam);border:1px solid rgba(237,229,210,.1);border-left:3px solid var(--amber);
  border-radius:var(--radius);padding:1.4rem 1.5rem;max-width:36rem;margin:0 auto 2rem}
.artifact .prov{font-family:"Albert Sans",sans-serif;font-size:.78rem;color:var(--taupe);
  letter-spacing:.03em;margin:0 0 .8rem}
.artifact .class{font-family:"Albert Sans",sans-serif;font-size:.68rem;letter-spacing:.2em;
  text-transform:uppercase;color:var(--amber);margin:0 0 .5rem}
.artifact .doc{font-style:italic}
.pagelinks{text-align:center;margin:2rem 0 3rem;font-family:"Albert Sans",sans-serif;font-size:.85rem}
.pagelinks a{margin:0 .7rem}

/* ---- locked / sealed ---- */
.sealed,.lockedpage{text-align:center;padding:4rem 0}
.sealed .seal,.lockedpage .seal{width:110px;height:110px;margin:0 auto 1.5rem;color:var(--taupe)}
.sealed h1,.lockedpage h1{font-size:clamp(1.6rem,5vw,2.3rem)}
.sealed p,.lockedpage p{margin:1.2rem auto 0;max-width:30rem;color:var(--tallow)}
.sealed .opens{margin-top:1rem;color:var(--taupe);font-family:"Albert Sans",sans-serif;
  font-size:.8rem;letter-spacing:.1em;text-transform:uppercase}
form.subscribe{margin:2rem auto 0;max-width:24rem;display:flex;gap:.5rem}
form.subscribe input{flex:1;background:var(--loam);border:1px solid rgba(237,229,210,.18);
  border-radius:var(--radius);color:var(--bone);padding:.6rem .8rem;font-family:"Albert Sans",sans-serif;font-size:.9rem}
form.subscribe button{background:var(--amber);color:var(--bedrock);border:0;border-radius:var(--radius);
  padding:.6rem 1rem;font-family:"Albert Sans",sans-serif;font-weight:500;letter-spacing:.04em;cursor:pointer}

/* ---- draft marker (staging only) ---- */
.draft{background:#3a2a10;border:1px dashed var(--amber);color:var(--tallow);
  font-family:"Albert Sans",sans-serif;font-size:.8rem;letter-spacing:.03em;
  padding:.6rem .9rem;border-radius:var(--radius);max-width:36rem;margin:0 auto 1.5rem;text-align:center}

footer.site{border-top:1px solid rgba(237,229,210,.08);margin-top:2rem;padding:2.5rem 0;text-align:center}
footer.site .creed{font-style:italic;color:var(--amber);margin:.6rem 0 0}
footer.site .meta{margin-top:.4rem}

@media(prefers-reduced-motion:reduce){*{transition:none!important;animation:none!important}}
@media print{
  :root{color-scheme:light}
  body{background:#fff;color:#171310}
  .pagelinks,form.subscribe,footer.site{display:none}
  .artifact{border-color:#847A6A}
}
`;

function siteFooter() {
  return `<footer class="site"><div class="wrap">
    <p class="creed">Old light, carried underground.</p>
    <p class="meta">The Aelf-King Sagas &middot; S.C. Kincaid</p>
  </div></footer>`;
}

// ---- one hub door ----------------------------------------------------------
function door(obs, href) {
  const numeral = obs.kind === "night" ? `Night ${obs.n}` : obs.label;
  if (obs.state === "open") {
    return `<a class="door open" href="${href}">
      ${seal("seal")}<span class="num">${esc(numeral)}</span>
      <span class="face">Open</span></a>`;
  }
  // locked: the card back, the date it opens, and nothing else.
  return `<div class="door locked">
    ${seal("seal")}<span class="num">${esc(numeral)}</span>
    <span class="opens">Opens ${esc(obs.opensOn)}</span></div>`;
}

// ---- the hub (open season) -------------------------------------------------
export function hubPage(season) {
  const hrefFor = (o) => o.kind === "ember" ? "/ember-night.html" : `/o/${o.id}.html`;
  const doors = season.observances.map((o) => door(o, hrefFor(o))).join("\n");
  const body = `<main class="wrap">
  <header class="masthead">
    ${seal("seal")}
    <h1>The Twelve Nights</h1>
    <p class="tagline">A winter archive. The night arrives when the night arrives, wherever you are.</p>
  </header>
  ${waterline()}
  <section class="doors">
  ${doors}
  </section>
  <p class="meta" style="text-align:center;margin:1.5rem 0 2rem">
    New to this? <a href="/what-this-is.html">How a household begins.</a>
  </p>
  </main>
  ${siteFooter()}`;
  return layout({
    title: "The Twelve Nights",
    description: "A winter archive of fourteen observances, opening one night at a time from Ember Night to Epiphany.",
    body, bodyClass: "hub",
  });
}

// ---- the sealed hub (Jan 7 to Oct 31) --------------------------------------
export function sealedPage(season) {
  const body = `<main class="wrap sealed">
    ${seal("seal")}
    <h1>The archive is closed until the autumn.</h1>
    <p>The nights are kept, then set down again. When the cold comes back, so do they. Leave a word and we will tell you when the first door opens.</p>
    <form class="subscribe" method="post" action="#" aria-label="Notify me when the season opens">
      <input type="email" name="email" placeholder="your email" aria-label="Email address" required>
      <button type="submit">Keep me a seat</button>
    </form>
    <p class="opens">Opens again on Ember Night, the fifteenth of December.</p>
  </main>
  ${siteFooter()}`;
  return layout({
    title: "The Twelve Nights",
    description: "The winter archive is closed until the autumn.",
    body, bodyClass: "sealed-state",
  });
}

// ---- a single observance page (open) ---------------------------------------
export function observancePage(obs, content, { draft = false } = {}) {
  const numeral = obs.kind === "night" ? `The ${ordinal(obs.n)} Night` : obs.label;
  const c = content || {};
  const draftBanner = draft
    ? `<div class="draft">DRAFT &middot; this observance has unwritten slots and must not ship. Run the audit.</div>` : "";
  const chronicler = c.chronicler ? `<p class="chronicler">${esc(c.chronicler)}</p>` : "";
  const reading = c.reading ? slot("Tonight's reading", `${esc(c.reading.saga)}, ${esc(c.reading.chapters)}`) : "";
  const observance = c.observance ? slot("The observance", esc(c.observance)) : "";
  const artifact = c.artifact ? `
    <div class="artifact">
      <p class="class">${esc(c.artifact.class)}</p>
      <p class="prov">${esc(c.artifact.provenance)}</p>
      <p class="doc">${esc(c.artifact.body)}</p>
    </div>` : "";
  const sheets = obs.state === "open" ? `<p class="pagelinks">
      <a href="/o/${esc(obs.id)}.print.html">Print this night</a>
      <a href="/o/${esc(obs.id)}.share.svg">Share image</a>
    </p>` : "";
  const body = `<main class="wrap obv">
    ${seal("seal")}
    <span class="eyebrow num">${esc(numeral)} &middot; ${esc(obs.opensOn)}</span>
    <h1>${esc((c.card && c.card.title) || obs.label)}</h1>
    ${draftBanner}
    ${chronicler}
    ${reading}
    ${observance}
    ${c.artifact ? `<div class="slot"><h2>A recovered document</h2></div>` : ""}
    ${artifact}
    ${sheets}
    <p class="pagelinks"><a href="/">Back to the archive</a></p>
  </main>
  ${siteFooter()}`;
  return layout({
    title: `${numeral} &middot; The Twelve Nights`,
    description: c.chronicler || `${numeral} of the winter archive.`,
    body, bodyClass: "observance",
  });
}

// ---- a locked observance page (accessed before its date: never a 404) ------
export function lockedObservancePage(obs) {
  const numeral = obs.kind === "night" ? `Night ${obs.n}` : obs.label;
  const body = `<main class="wrap lockedpage">
    ${seal("seal")}
    <span class="eyebrow">${esc(numeral)}</span>
    <h1>This night is not yet open.</h1>
    <p class="opens">Opens ${esc(obs.opensOn)}</p>
    <p class="pagelinks"><a href="/">Back to the archive</a></p>
  </main>
  ${siteFooter()}`;
  return layout({
    title: `${numeral} &middot; The Twelve Nights`,
    description: `${numeral} opens ${obs.opensOn}.`,
    body, bodyClass: "locked-state",
  });
}

export function whatThisIsPage() {
  const body = `<main class="wrap obv narrow">
    ${seal("seal")}
    <span class="eyebrow num">How a household begins</span>
    <h1>The Twelve Nights</h1>
    <p class="chronicler">There is no right way, and there is no catching up. You begin on the night you begin.</p>
    <div class="slot">
      <p>From the fifteenth of December the archive opens one door at a time. Each night carries a line to read, a short thing to do, and a document that someone kept. None of it takes more than a few minutes, and nothing is lost if you miss a night. The nights that have opened stay open until Epiphany. After the sixth of January the whole thing closes until the cold comes back.</p>
      <p>You do not need the book to keep the nights, though the readings follow it. You do not need an account. You need a few minutes after dark and, on the first night, a door you can open.</p>
    </div>
    <p class="pagelinks"><a href="/">Back to the archive</a></p>
  </main>
  ${siteFooter()}`;
  return layout({
    title: "How a household begins &middot; The Twelve Nights",
    description: "How to keep the Twelve Nights at home.",
    body, bodyClass: "what",
  });
}

// ---- print sheet: one page, this night alone -------------------------------
export function printSheet(obs, content) {
  const numeral = obs.kind === "night" ? `The ${ordinal(obs.n)} Night` : obs.label;
  const c = content || {};
  const body = `<main class="wrap obv narrow">
    <span class="eyebrow num">${esc(numeral)} &middot; ${esc(obs.opensOn)}</span>
    <h1>${esc((c.card && c.card.title) || obs.label)}</h1>
    ${c.chronicler ? `<p class="chronicler">${esc(c.chronicler)}</p>` : ""}
    ${c.reading ? slot("Tonight's reading", `${esc(c.reading.saga)}, ${esc(c.reading.chapters)}`) : ""}
    ${c.observance ? slot("The observance", esc(c.observance)) : ""}
    ${c.artifact ? `<div class="artifact"><p class="class">${esc(c.artifact.class)}</p>
      <p class="prov">${esc(c.artifact.provenance)}</p><p class="doc">${esc(c.artifact.body)}</p></div>` : ""}
    <p class="meta" style="text-align:center;margin-top:2rem">The Twelve Nights &middot; S.C. Kincaid</p>
  </main>`;
  return layout({
    title: `${numeral} (print) &middot; The Twelve Nights`,
    description: `A one-page sheet for ${numeral}.`,
    body, bodyClass: "print",
  });
}

// ---- share image: the card at social dimensions (1200x630) -----------------
export function shareSVG(obs, content) {
  const numeral = obs.kind === "night" ? `The ${ordinal(obs.n)} Night` : obs.label;
  const c = content || {};
  const title = (c.card && c.card.title) || obs.label;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630" role="img" aria-label="${esc(numeral)}: ${esc(title)}">
  <rect width="1200" height="630" fill="#171310"/>
  <rect x="24" y="24" width="1152" height="582" fill="none" stroke="#847A6A" stroke-opacity="0.3"/>
  <g transform="translate(600,150) scale(1.1)">${sealInner()}</g>
  <text x="600" y="370" text-anchor="middle" fill="#847A6A" font-family="Albert Sans, sans-serif"
    font-size="26" letter-spacing="6" style="text-transform:uppercase">${esc(numeral.toUpperCase())} &#183; ${esc(obs.opensOn.toUpperCase())}</text>
  <text x="600" y="450" text-anchor="middle" fill="#EDE5D2" font-family="Libre Caslon Display, serif"
    font-size="64" font-style="italic">${esc(title)}</text>
  <text x="600" y="560" text-anchor="middle" fill="#C28A2E" font-family="Libre Caslon Text, serif"
    font-size="28" font-style="italic">Old light, carried underground.</text>
</svg>`;
}

// seal interior without its own <svg> wrapper, for embedding in the share image
function sealInner() {
  return `<circle cx="0" cy="0" r="55" fill="none" stroke="#EDE5D2" stroke-width="1"/>
  <line x1="-50" y1="0" x2="50" y2="0" stroke="#EDE5D2" stroke-width="0.8"/>
  <path d="M-26 0 Q0 -12 26 0 Z" fill="#EDE5D2"/>
  <g fill="none" stroke="#EDE5D2" stroke-width="0.9" stroke-linecap="round">
    <path d="M0 -6 V-26 M0 -16 L-10 -27 M0 -16 L10 -27 M-10 -27 L-15 -35 M10 -27 L15 -35"/>
  </g>
  <g fill="none" stroke="#EDE5D2" stroke-width="0.7" stroke-linecap="round">
    <path d="M0 0 L-12 20 M0 0 L12 20 M-12 20 L-20 34 M12 20 L20 34"/>
  </g>
  <path d="M0 0 L0 42" stroke="#C28A2E" stroke-width="1"/>
  <circle cx="0" cy="43" r="1.8" fill="#C28A2E"/>`;
}

function slot(label, html) {
  return `<div class="slot"><h2>${esc(label)}</h2><p>${html}</p></div>`;
}

function ordinal(n) {
  return ["", "First", "Second", "Third", "Fourth", "Fifth", "Sixth", "Seventh",
    "Eighth", "Ninth", "Tenth", "Eleventh", "Twelfth"][n] || `${n}th`;
}
