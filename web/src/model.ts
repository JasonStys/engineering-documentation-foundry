/** File: Typed client state and byte-preserving file handling by Jason Stys.
 * Backend SourceRegistry/PDF validation remains authoritative. See docs/file-reference.md.
 */
export type Json =
  null | boolean | number | string | Json[] | { [key: string]: Json };
export type Obj = { [key: string]: Json };
export interface Project {
  id: string;
  revision: number;
  title: string;
  input: Obj;
}
export interface Draft {
  context: number;
  edit: number;
  id: string | null;
  revision: number;
  dirty: boolean;
}
export interface Capture {
  context: number;
  edit: number;
}

export function object(value: Json | undefined): Obj {
  if (!value || typeof value !== "object" || Array.isArray(value))
    throw new Error("The application returned an invalid object");
  return value;
}
export function list(value: Json | undefined): Json[] {
  if (!Array.isArray(value))
    throw new Error("The application returned an invalid list");
  return value;
}
export function text(value: Json | undefined): string {
  if (typeof value !== "string")
    throw new Error("The application returned invalid text");
  return value;
}
export function integer(value: Json | undefined): number {
  if (typeof value !== "number" || !Number.isSafeInteger(value) || value < 0)
    throw new Error("The application returned an invalid count/revision");
  return value;
}
export function id(value: Json | undefined): string {
  const result = text(value);
  if (!/^[a-f0-9]{32}$/u.test(result))
    throw new Error("Invalid saved record identity");
  return result;
}
export function project(value: Json): Project {
  const row = object(value);
  const revision = integer(row["revision"]);
  if (revision < 1) throw new Error("Saved revision is absent");
  return {
    id: id(row["id"]),
    revision,
    title: text(row["title"]),
    input: object(row["input"]),
  };
}
export function pretty(value: Json): string {
  return JSON.stringify(value, null, 2);
}
export function blank(): Obj {
  return {
    title: "My documentation project",
    registry: { registry_version: 1, sources: [] },
    limits: { max_pages: 100, max_blocks_per_page: 5000, heading_ratio: 1.25 },
  };
}
export function capture(draft: Draft): Capture {
  return { context: draft.context, edit: draft.edit };
}
export function sameContext(draft: Draft, captured: Capture): boolean {
  return draft.context === captured.context;
}
export function unchanged(draft: Draft, captured: Capture): boolean {
  return sameContext(draft, captured) && draft.edit === captured.edit;
}
export function savedState(
  draft: Draft,
  captured: Capture,
  saved: Project,
): Draft {
  if (!sameContext(draft, captured)) return draft;
  return {
    ...draft,
    id: saved.id,
    revision: saved.revision,
    dirty: !unchanged(draft, captured),
  };
}
export function validFileSize(bytes: number, maximum: number): void {
  if (!Number.isSafeInteger(bytes) || bytes <= 0 || bytes > maximum)
    throw new Error(
      `Choose a nonempty file within ${maximum / 1024 / 1024} MiB`,
    );
}
export function base64(bytes: Uint8Array): string {
  const parts: string[] = [];
  for (let start = 0; start < bytes.length; start += 32768)
    parts.push(String.fromCharCode(...bytes.subarray(start, start + 32768)));
  return btoa(parts.join(""));
}
export function fileText(bytes: Uint8Array): string {
  return new TextDecoder("utf-8", { fatal: true }).decode(bytes);
}
