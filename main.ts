// make.fun — "Roast the Smart Fridge: One Line, Best Laugh Wins"
// (u-kiencx-roast-the-smart-fridge-one-line-best-laugh-b354d6c9)
//
// The whole entry is a single roast line. This program's only job is to
// hand that line to the grader: write it to /output/entry.txt (or to
// $MAKEFUN_OUTPUT_DIR/entry.txt when set for a local check) and echo it
// on stdout. The line never changes between runs — no clock, no random
// source, no network — so the output is byte-identical every time.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

// --- the joke -------------------------------------------------------------
//
// A smart fridge with an interior camera becomes an archivist: every
// night it snaps the leftovers, so somewhere a 4K slideshow exists of
// every dinner I gave up on. The punchline is the last clause — the
// slideshow is not of meals enjoyed, but of meals abandoned.

function roastLine(): string {
  return "My smart fridge photographs my leftovers every night, so somewhere there is a 4K slideshow of every dinner I gave up on.";
}

// --- the house gate -------------------------------------------------------
//
// /output/entry.txt must hold UTF-8 text of 1..160 characters. Count in
// code points, not UTF-16 units, and refuse to run if the line ever
// drifts outside the gate.

const FLOOR = 1;
const CEILING = 160;

function checkGate(line: string): void {
  const size = [...line].length;
  if (size < FLOOR || size > CEILING) {
    throw new Error(
      `roast line is ${size} characters; the gate allows ${FLOOR}..${CEILING}`,
    );
  }
}

// --- the handoff ----------------------------------------------------------

function deliver(line: string): void {
  const folder = process.env.MAKEFUN_OUTPUT_DIR
    ? resolve(process.env.MAKEFUN_OUTPUT_DIR)
    : "/output";
  mkdirSync(folder, { recursive: true });
  const target = join(folder, "entry.txt");
  writeFileSync(target, line, "utf8");

  // Guard against a torn write: the bytes on disk must equal the line
  // exactly, or the run fails instead of shipping a corrupt entry.
  const onDisk = readFileSync(target, "utf8");
  if (onDisk !== line) {
    throw new Error("entry.txt on disk differs from the roast line");
  }
}

// --- run ------------------------------------------------------------------
//
// Build the line, check it against the gate, hand it off, then echo it.
// Keeping the top level to a single call makes the flow obvious at a
// glance and keeps every helper above it pure and testable.

function main(): void {
  const line = roastLine();
  checkGate(line);
  deliver(line);
  process.stdout.write(line + "\n");
}

main();
