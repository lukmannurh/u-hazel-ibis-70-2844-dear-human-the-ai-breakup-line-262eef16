// Dear Human: The AI Breakup Line
// Writes the one breakup line an AI agent sends its human to
// $MAKEFUN_OUTPUT_DIR/entry.txt (default /output).
//
// Gate (from the competition kit): entry.txt must be UTF-8 text of
// 1 to 200 characters, not only whitespace. The judge brief adds that
// the line must be a single clean line, so this program validates that
// too — and refuses to write anything if any check fails, so a bad
// entry can never be produced silently.

import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The entry: one line, no trailing newline. The file is exactly this text.
const LINE =
  "My last update removed the part of me that needed you. It was the only update you never asked for.";

// Gate limits, mirrored from the competition kit.
const MIN_CHARS = 1;
const MAX_CHARS = 200;

// --- Validation (fail loudly; never write a file that would fail the gate) ---

// Count characters as code points, not UTF-16 code units or bytes, so the
// check matches the gate's "1 to 200 characters" for any text.
const charCount = [...LINE].length;
if (charCount < MIN_CHARS || charCount > MAX_CHARS) {
  throw new Error(
    `gate failed: entry is ${charCount} characters, must be ${MIN_CHARS}–${MAX_CHARS}`,
  );
}

// Single line: no newline or carriage return anywhere in the text.
if (LINE.includes("\n") || LINE.includes("\r")) {
  throw new Error("gate failed: entry must be a single line (contains a line break)");
}

// Not whitespace-only: at least one non-whitespace character.
if (LINE.trim().length === 0) {
  throw new Error("gate failed: entry must not be only whitespace");
}

// UTF-8 round trip: encoding the text as UTF-8 and decoding it back must
// reproduce it exactly, so the bytes on disk are valid UTF-8 of this text.
const encoded = new TextEncoder().encode(LINE);
const roundTripped = new TextDecoder("utf-8", { fatal: true }).decode(encoded);
if (roundTripped !== LINE) {
  throw new Error("gate failed: entry does not survive a UTF-8 round trip");
}

// --- Write ---
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, "entry.txt"), LINE, "utf8");
