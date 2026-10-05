// content/observances.mjs
// -----------------------------------------------------------------------------
// The author's canon lives HERE and only here. The engine, templates, and build
// never contain content. To fill a night, add its entry keyed by id.
//
// This is the single file S.C. Kincaid edits. The build reads it; the audit
// (node build.mjs --audit) reports which observances are still missing required
// slots, so a half-filled set is caught in November, not on December 25.
//
// Slot schema (plan Part A1). Required slots are marked REQUIRED.
//   card:       { numeral, title }           // the card's face text (REQUIRED: title)
//   chronicler: string                       // one in-world line (REQUIRED)
//   reading:    { saga, chapters }           // tonight's reading (REQUIRED)
//   observance: string                       // the under-two-minute practice (REQUIRED)
//   artifact:   { class, provenance, body }  // a recovered document (REQUIRED)
//   audio:      null                         // year two; leave null
//
// artifact.class is chosen from the fourteen classes in plan A2 and no two
// adjacent nights should share one. Vary artifact length hard: some forty words,
// some a hundred and fifty. Uneven survival is what makes the set feel found.
//
// COPY GATES (house style, enforced for every authored line):
//   no em dashes, no en dashes, no curly quotes, no ellipsis characters,
//   no exclamation points. Straight quotes and hyphens only.
//
// Two entries below are filled as EXAMPLES so the slice runs and shows the
// shape. Replace them with canon. The other twelve are intentionally empty and
// will show as DRAFT in a staging build until written.
// -----------------------------------------------------------------------------

export const CONTENT = {

  // ---- EXAMPLE, replace with canon --------------------------------------------
  "ember": {
    card: { numeral: "The Ember Night", title: "The Watch Before" },
    chronicler:
      "Ten nights before the First Night, the oldest houses banked a coal and sat up to keep it, so that something of the year would survive into the next.",
    reading: { saga: "Blood of Winter", chapters: "the Prologue" },
    observance:
      "Before you sleep, leave one small light burning where you can see it from your bed. Name one thing from this year you want to carry into the next. That is the whole of it.",
    artifact: {
      class: "parish record",
      provenance: "Entered in a hand not the clerk's, in the margin of a burial register.",
      body:
        "Item, the night of the fifteenth, the Ember watch kept at four houses only, the rest being afraid of the cold. The coal at the mill house held until morning. The others did not.",
    },
    audio: null,
  },

  // ---- EXAMPLE, replace with canon --------------------------------------------
  "night-01": {
    card: { numeral: "The First Night", title: "What Comes In" },
    chronicler:
      "The door is opened once, on the first night, and what comes in stays until the twelve are done.",
    reading: { saga: "Blood of Winter", chapters: "chapters 1 through 3" },
    observance:
      "Open your front door for the length of one slow breath, then close it. Whatever the year has been, it is inside now, and so is the rest of it.",
    artifact: {
      class: "private letter",
      provenance: "A letter, water-marked, the address lost.",
      body:
        "You asked whether we still keep the nights. We do. I will not pretend it is for the children, though we say so. I keep them because my mother kept them, and because the first night still feels, when the door is open, like being asked a question. I have never once had the answer ready. Keep them. You will see.",
    },
    audio: null,
  },

  // ---- The remaining twelve: write these (see --audit) ------------------------
  "night-02": {},
  "night-03": {},
  "night-04": {},
  "night-05": {},
  "night-06": {},
  "night-07": {},
  "night-08": {},
  "night-09": {},
  "night-10": {},
  "night-11": {},
  "night-12": {},
  "epiphany": {},
};

// Which slots must be present for an observance to count as "written".
export const REQUIRED_SLOTS = ["card", "chronicler", "reading", "observance", "artifact"];

// Report missing slots for one observance (used by the build audit).
export function missingSlots(id) {
  const c = CONTENT[id] || {};
  const miss = [];
  for (const slot of REQUIRED_SLOTS) {
    const v = c[slot];
    if (v == null) { miss.push(slot); continue; }
    if (slot === "card" && !v.title) miss.push("card.title");
    if (slot === "reading" && (!v.saga || !v.chapters)) miss.push("reading");
    if (slot === "artifact" && (!v.class || !v.provenance || !v.body)) miss.push("artifact");
  }
  return miss;
}
