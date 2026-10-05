// build.mjs
// -----------------------------------------------------------------------------
// Renders the static archive for a given civil "now". The whole gate lives here:
// only observances whose state is "open" get their content, print sheet, and
// share image written to disk. Locked and sealed observances render as a card
// back plus an open date, and NO content or asset files are emitted for them.
// Peeking is impossible because the locked material is not in the build.
//
// Usage:
//   node build.mjs                        build for the real "now" (Central)
//   node build.mjs --now=2026-12-27       time travel to a civil date
//   node build.mjs --out=dist --staging   staging shows DRAFT banners
//   node build.mjs --audit                report unwritten observances and exit
// -----------------------------------------------------------------------------

import { mkdir, rm, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { resolveSeason, civilNow, OBSERVANCES } from "./lib/season.mjs";
import * as T from "./lib/templates.mjs";
import { CONTENT, missingSlots } from "./content/observances.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));

function parseArgs(argv) {
  const a = { out: "dist", now: null, staging: false, audit: false, tz: "America/Chicago" };
  for (const arg of argv) {
    if (arg.startsWith("--now=")) a.now = arg.slice(6);
    else if (arg.startsWith("--out=")) a.out = arg.slice(6);
    else if (arg.startsWith("--tz=")) a.tz = arg.slice(5);
    else if (arg === "--staging") a.staging = true;
    else if (arg === "--audit") a.audit = true;
  }
  // env override so the Actions cron and tests can set the clock
  if (!a.now && process.env.TN_NOW) a.now = process.env.TN_NOW;
  return a;
}

export function auditReport() {
  return OBSERVANCES.map((o) => ({ id: o.id, missing: missingSlots(o.id) }))
    .filter((r) => r.missing.length > 0);
}

export async function build(opts = {}) {
  const now = civilNow({ tz: opts.tz || "America/Chicago", override: opts.now || null });
  const season = resolveSeason(now);
  const outDir = resolve(HERE, opts.out || "dist");
  const written = [];

  const write = async (rel, contents) => {
    const full = join(outDir, rel);
    await mkdir(dirname(full), { recursive: true });
    await writeFile(full, contents, "utf8");
    written.push(rel);
  };

  await rm(outDir, { recursive: true, force: true });
  await mkdir(outDir, { recursive: true });
  await write("style.css", T.CSS);

  // Hub: the sealed state out of season, the doors in season.
  await write("index.html", season.sealed ? T.sealedPage(season) : T.hubPage(season));
  await write("what-this-is.html", T.whatThisIsPage());

  for (const obs of season.observances) {
    const content = CONTENT[obs.id] || {};
    const isDraft = missingSlots(obs.id).length > 0;
    const pageRel = obs.kind === "ember" ? "ember-night.html" : `o/${obs.id}.html`;

    if (obs.state === "open") {
      // full content + generated assets, written ONLY now that it has unlocked
      await write(pageRel, T.observancePage(obs, content, { draft: opts.staging && isDraft }));
      await write(`o/${obs.id}.print.html`, T.printSheet(obs, content));
      await write(`o/${obs.id}.share.svg`, T.shareSVG(obs, content));
    } else {
      // locked or sealed: card back + open date, never a 404, no secret content
      await write(pageRel, T.lockedObservancePage(obs));
    }
  }

  return { outDir, season, written, audit: auditReport() };
}

// ---- CLI -------------------------------------------------------------------
if (import.meta.url === `file://${process.argv[1]}`) {
  const args = parseArgs(process.argv.slice(2));

  if (args.audit) {
    const report = auditReport();
    if (report.length === 0) {
      console.log("Audit: all fourteen observances are written.");
      process.exit(0);
    }
    console.log(`Audit: ${report.length} observance(s) have unwritten slots:`);
    for (const r of report) console.log(`  ${r.id.padEnd(10)} missing: ${r.missing.join(", ")}`);
    process.exit(1);
  }

  const res = await build(args);
  const open = res.season.observances.filter((o) => o.state === "open").length;
  const state = res.season.sealed ? "SEALED" : `${open} open of ${res.season.observances.length}`;
  console.log(`Built for ${res.now ? "" : ""}${args.now || "today"} (season ${res.season.seasonYear}): ${state}`);
  console.log(`  -> ${res.outDir}  (${res.written.length} files)`);
  if (res.audit.length) {
    console.log(`  note: ${res.audit.length} observance(s) still unwritten (node build.mjs --audit)`);
  }
}
