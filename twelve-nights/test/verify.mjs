// test/verify.mjs
// -----------------------------------------------------------------------------
// The checks from plan Part C, run with no browser and no network:
//   C1  Time-travel: walk the season and confirm the right doors open, locked
//       pages render (never a 404), and no locked content reaches the build.
//   C3  Rollover: January derives to the previous season year.
//   +   Asset absence: locked nights emit no print sheet or share image, and
//       their secret lines appear nowhere in the output (plan B2).
//
//   node test/verify.mjs        exits 0 on pass, 1 on any failure
// -----------------------------------------------------------------------------

import { mkdtemp, rm, readFile, readdir, stat } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { build } from "../build.mjs";
import { CONTENT } from "../content/observances.mjs";

let failures = 0;
const ok = (cond, msg) => {
  console.log(`${cond ? "  ok  " : "FAIL  "}${msg}`);
  if (!cond) failures++;
};

async function walk(dir, base = dir, acc = []) {
  for (const name of await readdir(dir)) {
    const full = join(dir, name);
    if ((await stat(full)).isDirectory()) await walk(full, base, acc);
    else acc.push(full.slice(base.length + 1));
  }
  return acc;
}

async function allText(dir) {
  const files = await walk(dir);
  const texts = await Promise.all(files.map((f) => readFile(join(dir, f), "utf8")));
  return { files, blob: texts.join("\n") };
}

async function buildAt(now) {
  const out = await mkdtemp(join(tmpdir(), "tn-"));
  const res = await build({ now, out });
  return { res, out };
}

// Canary lines: content that must never appear while its night is locked.
const CANARY = {
  ember: CONTENT.ember.chronicler,
  "night-01": CONTENT["night-01"].chronicler,
};

async function openCountAt(now, expectedOpen, expectSealed) {
  const { res, out } = await buildAt(now);
  const open = res.season.observances.filter((o) => o.state === "open").map((o) => o.id);
  ok(res.season.sealed === expectSealed, `${now}: sealed=${res.season.sealed} (expected ${expectSealed})`);
  ok(open.length === expectedOpen, `${now}: ${open.length} open (expected ${expectedOpen}) [${open.join(",")}]`);

  // every observance has a page (no 404), open or not
  const { files, blob } = await allText(out);
  const pages = ["ember-night.html", "o/night-01.html", "o/epiphany.html"];
  for (const p of pages) ok(files.includes(p), `${now}: page present ${p}`);

  // locked canaries must not leak; locked nights must emit no assets
  for (const [id, line] of Object.entries(CANARY)) {
    const isOpen = open.includes(id);
    if (!isOpen) {
      ok(!blob.includes(line), `${now}: ${id} content absent from build`);
      const assetPrefix = `o/${id}.`;
      const assets = files.filter((f) => f.startsWith(assetPrefix) && (f.endsWith(".print.html") || f.endsWith(".share.svg")));
      ok(assets.length === 0, `${now}: ${id} emits no print/share while locked`);
    }
  }
  await rm(out, { recursive: true, force: true });
}

console.log("C1  Time-travel walk");
await openCountAt("2026-12-14", 0, false);   // nothing open yet
await openCountAt("2026-12-15", 1, false);   // Ember only
await openCountAt("2026-12-25", 2, false);   // Ember + First Night
await openCountAt("2026-12-31", 8, false);   // Ember + Nights 1-7
await openCountAt("2027-01-03", 11, false);  // Ember + Nights 1-10 (rolled into January)
await openCountAt("2027-01-06", 14, false);  // all open through Epiphany
await openCountAt("2027-01-07", 0, true);    // sealed

console.log("\nC3  Rollover");
{
  const { res, out } = await buildAt("2027-01-03");
  ok(res.season.seasonYear === 2026, `Jan 3 2027 derives season year 2026 (got ${res.season.seasonYear})`);
  const n10 = res.season.observances.find((o) => o.id === "night-10");
  ok(n10.state === "open", `Night 10 (Jan 3) is open on Jan 3 2027 (got ${n10.state})`);
  const n11 = res.season.observances.find((o) => o.id === "night-11");
  ok(n11.state === "locked", `Night 11 (Jan 4) still locked on Jan 3 2027 (got ${n11.state})`);
  await rm(out, { recursive: true, force: true });
}

console.log("\nAsset absence spot check (Dec 15: Ember open, First Night locked)");
{
  const { out } = await buildAt("2026-12-15");
  const { files } = await allText(out);
  ok(files.includes("o/ember.share.svg"), "Ember share image present when open");
  ok(files.includes("o/ember.print.html"), "Ember print sheet present when open");
  ok(files.includes("o/night-01.html"), "First Night page present (locked view, no 404)");
  ok(!files.some((f) => f === "o/night-01.print.html" || f === "o/night-01.share.svg"),
    "First Night emits no print/share while locked");
  await rm(out, { recursive: true, force: true });
}

console.log(`\n${failures === 0 ? "PASS" : "FAIL"}: ${failures} failure(s)`);
process.exit(failures === 0 ? 0 : 1);
