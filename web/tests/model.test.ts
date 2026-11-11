/** File: Independent editing/byte/identity contracts for the real client by Jason Stys. */
import assert from "node:assert/strict";
import test from "node:test";
import {
  base64,
  blank,
  capture,
  fileText,
  id,
  integer,
  object,
  project,
  savedState,
  unchanged,
  validFileSize,
  type Draft,
  type Project,
} from "../src/model.js";

const saved: Project = {
  id: "a".repeat(32),
  revision: 3,
  title: "Actual captured snapshot",
  input: blank(),
};
test("a captured save cannot replace another selected project or its editor", () => {
  const initial: Draft = {
    context: 1,
    edit: 2,
    id: "b".repeat(32),
    revision: 2,
    dirty: true,
  };
  const request = capture(initial);
  const selected = { ...initial, context: 2, edit: 3, id: "c".repeat(32) };
  assert.equal(savedState(selected, request, saved), selected);
  assert.equal(unchanged(selected, request), false);
});
test("typing during a real save retains unsaved edits but advances only that project's known base", () => {
  const initial: Draft = {
    context: 1,
    edit: 2,
    id: saved.id,
    revision: 2,
    dirty: true,
  };
  const request = capture(initial);
  const edited = { ...initial, edit: 3 };
  assert.deepEqual(savedState(edited, request, saved), {
    ...edited,
    revision: 3,
    dirty: true,
  });
  assert.deepEqual(savedState(initial, request, saved), {
    ...initial,
    revision: 3,
    dirty: false,
  });
});
test("actual binary and UTF8 data preserve leading zero/nonASCII bytes across source import", () => {
  const bytes = Uint8Array.from([0, 1, 127, 128, 255]);
  assert.equal(base64(bytes), Buffer.from(bytes).toString("base64"));
  assert.equal(
    fileText(new TextEncoder().encode("Calibration — résumé")),
    "Calibration — résumé",
  );
  assert.throws(() => fileText(Uint8Array.from([0xff])));
});
test("file and response guards reject invalid counts, ambiguous objects and forged record IDs", () => {
  for (const bytes of [0, -1, NaN, Infinity, 1001])
    assert.throws(() => validFileSize(bytes, 1000));
  validFileSize(1000, 1000);
  for (const value of [null, [], false, "value"])
    assert.throws(() => object(value));
  for (const value of [true, -1, 1.5, Infinity])
    assert.throws(() => integer(value));
  for (const value of ["../outside", "A".repeat(32), "a".repeat(31)])
    assert.throws(() => id(value));
});
test("empty drafts remain visibly unsaved and saved projects require a real positive revision", () => {
  assert.deepEqual(object(blank()["registry"])["sources"], []);
  assert.throws(() =>
    project({ id: saved.id, revision: 0, title: "not saved", input: blank() }),
  );
  assert.deepEqual(
    project({
      id: saved.id,
      revision: saved.revision,
      title: saved.title,
      input: saved.input,
    }),
    saved,
  );
});
