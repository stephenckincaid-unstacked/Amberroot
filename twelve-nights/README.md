# The Twelve Nights

A static, self-gating winter archive: fourteen observances (Ember Night, the
Twelve Nights, Epiphany) that open one at a time from December 15, stay open
through Epiphany, then seal until the following autumn. No framework, no
database, no annual maintenance. This directory is the **first vertical slice**:
the engine, the hub, a fully worked observance page, the locked and sealed
states, and the Part C verification harness.

## The one idea

Dates are data and the year is derived. Nothing stores a literal date or "2026".
Each observance declares only its month and day; the season year is computed:

```
season_year = (month is January) ? current_year - 1 : current_year
```

so the January nights belong to the December that began the season. It is not
configured for a year; it is configured for December. See `lib/season.mjs`.

## Run it

```
cd twelve-nights
node test/verify.mjs            # Part C: time-travel, rollover, no-leak checks
node build.mjs                  # build for the real "now" (sealed in October)
node build.mjs --now=2026-12-25 # time-travel to any civil date
node build.mjs --audit          # list observances still missing slots
```

Preview over HTTP (the pages use root-absolute paths, so `file://` will not load
the stylesheet):

```
node build.mjs --now=2026-12-25 --out=dist --staging
cd dist && python3 -m http.server 8000   # then open http://localhost:8000
```

## The no-peek guarantee

The build writes content, print sheet, and share image **only** for observances
whose state is `open`. Locked and sealed observances render as a card back plus
an open date, and no content or asset files are emitted for them. The locked
material is absent from the output, not hidden with CSS, so viewing source
reveals nothing. `test/verify.mjs` asserts this with canary lines.

## Writing the content

`content/observances.mjs` is the only file the author edits. Two entries (Ember
Night, the First Night) are filled as **examples** and must be replaced with
canon; the other twelve are empty and show as DRAFT in a staging build. Slot
schema, the fourteen artifact classes, and the copy gates are documented at the
top of that file. `node build.mjs --audit` reports what is still unwritten.

## Decisions baked in (change in one place)

- **Timezone (plan B3): fixed hour, Central.** A static rebuild cannot gate per
  visitor, so a night opens for everyone when the daily build runs. Change the
  zone via `--tz=` or the `TN_NOW` env; the chronicler copy says "the night
  arrives when the night arrives."
- **Season window / seal (plan A4):** open Nov 1 through Epiphany (Jan 6), sealed
  Jan 7 through Oct 31. In `isSealed()` in `lib/season.mjs`.

## What is NOT done yet (next steps)

- **Deploy target.** This repo's Pages serves the press site from the branch
  root. A repo has one Pages source, so the archive needs its own home
  (sckincaid.com, a subdomain, or a separate repo/Pages site). The workflow at
  `.github/workflows/twelve-nights.yml` builds, tests, and uploads the output as
  an artifact; fill in its deploy step once the host is chosen.
- **The other twelve observances** (yours to write) and the real card art.
- **Print sheet as PDF.** The slice generates a print-optimized HTML page; add a
  headless-Chrome PDF step in the workflow when wanted.
- **Email capture wiring** on the sealed page (B4 is scheduled in your email
  platform; the form here just needs its `action` pointed at that platform).
- **Audio** is year two by design.
