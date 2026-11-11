/** File: Jason Stys's real source-authoring, PDF build, cited review and exact-export workflows.
 * All input/output comes from the owned backend; no synthetic API reply or remote UI resource exists.
 * Location map: docs/file-reference.md. */
import {
  blank,
  base64,
  capture,
  fileText,
  id,
  integer,
  list,
  object,
  pretty,
  project,
  savedState,
  sameContext,
  text,
  unchanged,
  validFileSize,
  type Draft,
  type Json,
  type Obj,
  type Project,
} from "./model.js";

function node(name: string): HTMLElement {
  const found = document.getElementById(name);
  if (!found) throw new Error(`Missing application control: ${name}`);
  return found;
}
function input(name: string): HTMLInputElement {
  const found = node(name);
  if (!(found instanceof HTMLInputElement))
    throw new Error("Input control is absent");
  return found;
}
function select(name: string): HTMLSelectElement {
  const found = node(name);
  if (!(found instanceof HTMLSelectElement))
    throw new Error("Selection control is absent");
  return found;
}
function button(name: string): HTMLButtonElement {
  const found = node(name);
  if (!(found instanceof HTMLButtonElement))
    throw new Error("Action control is absent");
  return found;
}
const editorNode = node("editor");
if (!(editorNode instanceof HTMLTextAreaElement))
  throw new Error("Project editor is absent");
const editor = editorNode;
const stored = sessionStorage.getItem("foundry-owner-capability");
const fragment = new URLSearchParams(location.hash.slice(1)).get("native");
const token = fragment ?? stored ?? "";
if (fragment && /^[a-zA-Z0-9_-]{32,100}$/u.test(fragment)) {
  sessionStorage.setItem("foundry-owner-capability", fragment);
  history.replaceState(null, "", location.pathname + location.search);
}
let draft: Draft = { context: 0, edit: 0, id: null, revision: 0, dirty: true };
let busy = false;
let selectedBuild: string | null = null;
let reviewEpoch = 0;
let listEpoch = 0;
let selectedRecord: Obj | null = null;
let comparison: Obj | null = null;
let comparisonEpoch = 0;

function status(message: string): void {
  node("status").textContent = message;
  node("error").hidden = true;
}
function failure(error: unknown): void {
  node("error").textContent =
    error instanceof Error
      ? error.message
      : "The action failed without a supported diagnostic";
  node("error").hidden = false;
}
function bind(
  name: string,
  event: string,
  action: (event: Event) => Promise<void> | void,
): void {
  node(name).addEventListener(event, (event) => {
    void Promise.resolve()
      .then(() => action(event))
      .catch(failure);
  });
}
async function api(path: string, body?: Json): Promise<Json> {
  const headers: Record<string, string> = { "X-Foundry-Capability": token };
  const settings: RequestInit = {
    headers,
    cache: "no-store",
    credentials: "same-origin",
  };
  if (body !== undefined) {
    headers["Content-Type"] = "application/json";
    settings.method = "POST";
    settings.body = JSON.stringify(body);
  }
  const response = await fetch(path, settings);
  const value: Json = await response.json();
  if (!response.ok)
    throw new Error(
      typeof object(value)["error"] === "string"
        ? text(object(value)["error"])
        : `Request failed (${response.status})`,
    );
  return value;
}
function refreshControls(): void {
  node("draft-state").textContent =
    draft.id === null
      ? "New unsaved draft"
      : `Saved project ${draft.id} / revision ${draft.revision}${draft.dirty ? " / unsaved edits" : ""}`;
  for (const name of [
    "validate",
    "save",
    "append-source",
    "create-example",
    "delete-project",
    "delete-build",
    "compare-builds",
  ])
    button(name).disabled = busy;
  button("build").disabled = busy || draft.id === null || draft.dirty;
  button("export-project").disabled = draft.id === null || draft.dirty;
  button("delete-project").disabled = busy || draft.id === null;
  button("delete-build").disabled = busy || selectedBuild === null;
  for (const name of [
    "export-build",
    "export-evidence",
    "use-input",
    "show-preview",
    "download-artifact",
    "find-topics",
  ])
    button(name).disabled = selectedBuild === null;
  input("pdf-file").disabled = busy;
  input("import-project").disabled = busy;
}
async function owned(action: () => Promise<void>): Promise<void> {
  if (busy)
    throw new Error(
      "Another authored operation is active; this requested action has not started",
    );
  busy = true;
  refreshControls();
  try {
    await action();
  } finally {
    busy = false;
    refreshControls();
  }
}
function applyDraft(value: Obj, saved?: Project): void {
  draft = {
    context: draft.context + 1,
    edit: draft.edit + 1,
    id: saved?.id ?? null,
    revision: saved?.revision ?? 0,
    dirty: saved === undefined,
  };
  editor.value = pretty(value);
  refreshControls();
}
function actionButton(
  label: string,
  action: () => Promise<void>,
): HTMLButtonElement {
  const result = document.createElement("button");
  result.type = "button";
  result.textContent = label;
  result.addEventListener("click", () => {
    void action().catch(failure);
  });
  return result;
}
function paragraph(
  value: string,
  className = "metadata",
): HTMLParagraphElement {
  const result = document.createElement("p");
  result.textContent = value;
  result.className = className;
  return result;
}
function emptyRecord(message: string): HTMLLIElement {
  const item = document.createElement("li");
  item.append(paragraph(message));
  return item;
}
function options(
  control: HTMLSelectElement,
  rows: { value: string; label: string }[],
  empty?: string,
): void {
  const previous = control.value;
  control.replaceChildren();
  if (empty !== undefined) rows = [{ value: "", label: empty }, ...rows];
  for (const row of rows) {
    const option = document.createElement("option");
    option.value = row.value;
    option.textContent = row.label;
    control.append(option);
  }
  if (rows.some((row) => row.value === previous)) control.value = previous;
}
function blobDownload(raw: Blob, filename: string): void {
  const href = URL.createObjectURL(raw);
  const anchor = document.createElement("a");
  anchor.href = href;
  anchor.download = filename;
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  setTimeout(() => URL.revokeObjectURL(href), 0);
}
async function download(path: string, filename: string): Promise<void> {
  const response = await fetch(path, {
    headers: { "X-Foundry-Capability": token },
    cache: "no-store",
  });
  if (!response.ok)
    throw new Error(text(object((await response.json()) as Json)["error"]));
  blobDownload(await response.blob(), filename);
}
async function refresh(): Promise<void> {
  const epoch = ++listEpoch;
  const [rawLibrary, rawProjects, rawBuilds, rawAll] = await Promise.all([
    api("/api/library"),
    api(
      "/api/projects?" +
        new URLSearchParams({ q: input("project-search").value }),
    ),
    api(
      "/api/builds?" +
        new URLSearchParams({
          q: input("build-search").value,
          status: select("build-status").value,
        }),
    ),
    api("/api/builds"),
  ]);
  if (epoch !== listEpoch) return;
  const library = list(rawLibrary).map(object);
  node("library").replaceChildren();
  for (const row of library) {
    const item = document.createElement("li");
    const digest = text(row["sha256"]);
    item.append(
      paragraph(text(row["name"]) + ` / ${integer(row["bytes"])} bytes`),
      paragraph(digest),
    );
    item.append(
      actionButton("Download exact source PDF", () =>
        download(
          "/api/source?" + new URLSearchParams({ sha256: digest }),
          "foundry-source-" + digest + ".pdf",
        ),
      ),
    );
    item.append(
      actionButton("Remove unreferenced PDF", async () => {
        if (editor.value.includes(digest))
          throw new Error(
            "This PDF appears in the current draft. Remove its declaration before deleting the source.",
          );
        if (
          !confirm(
            "Remove only this source PDF? Saved projects/builds and active work cannot lose referenced bytes.",
          )
        )
          return;
        await owned(async () => {
          await api("/api/delete-source", { sha256: digest });
          await refresh();
          status(
            "Removed only the explicitly selected unreferenced source PDF.",
          );
        });
      }),
    );
    node("library").append(item);
  }
  options(
    select("source-pdf"),
    library.map((row) => ({
      value: text(row["sha256"]),
      label: text(row["name"]) + " / " + text(row["sha256"]).slice(0, 12),
    })),
    "Choose an uploaded PDF",
  );
  node("projects").replaceChildren();
  for (const value of list(rawProjects)) {
    const row = object(value);
    const identifier = id(row["id"]);
    const item = document.createElement("li");
    item.append(
      actionButton(
        `${text(row["title"])} / revision ${integer(row["revision"])}`,
        async () => {
          const requestContext = ++draft.context;
          const loaded = project(
            await api(
              "/api/project?" + new URLSearchParams({ id: identifier }),
            ),
          );
          if (requestContext !== draft.context) return;
          applyDraft(loaded.input, loaded);
          status(
            `Loaded the actual saved project ${loaded.id}, revision ${loaded.revision}.`,
          );
        },
      ),
      paragraph(identifier),
    );
    node("projects").append(item);
  }
  if (list(rawProjects).length === 0)
    node("projects").append(
      emptyRecord("No saved projects match this literal title filter."),
    );
  node("builds").replaceChildren();
  for (const value of list(rawBuilds)) {
    const row = object(value);
    const identifier = id(row["id"]);
    const item = document.createElement("li");
    item.append(
      actionButton(
        `${text(row["title"])} / revision ${integer(row["revision"])} / ${text(row["status"])}`,
        () => chooseBuild(identifier),
      ),
      paragraph(identifier + " / " + text(row["created"])),
    );
    node("builds").append(item);
  }
  if (list(rawBuilds).length === 0)
    node("builds").append(
      emptyRecord("No retained builds match these filters."),
    );
  const compareOptions = list(rawAll)
    .map(object)
    .map((row) => ({
      value: id(row["id"]),
      label: `${text(row["title"])} / r${integer(row["revision"])} / ${text(row["status"])} / ${id(row["id"]).slice(0, 8)}`,
    }));
  options(
    select("before-build"),
    [...compareOptions].reverse(),
    "Choose before build",
  );
  options(select("after-build"), compareOptions, "Choose after build");
}
function metric(label: string, value: Json | undefined): HTMLElement {
  const result = document.createElement("div");
  result.className = "metric";
  const number = document.createElement("strong");
  number.textContent = String(value ?? "not provided");
  result.append(number, document.createTextNode(label));
  return result;
}
function renderTopics(value: Obj): void {
  const topics = list(value["topics"]);
  node("topic-count").textContent =
    `Showing ${topics.length} of ${integer(value["topic_total"])} actual canonical topics.`;
  node("topics").replaceChildren();
  for (const entry of topics) {
    const topic = object(entry);
    const article = document.createElement("article");
    article.className = "topic";
    const heading = document.createElement("h4");
    heading.textContent = text(topic["title"]);
    article.append(
      heading,
      paragraph(
        `${text(topic["content_type"])} / ${text(topic["source_id"])} / revision ${text(topic["source_revision"])}`,
      ),
    );
    for (const item of list(topic["blocks"])) {
      const block = object(item);
      const provenance = object(block["provenance"]);
      const section = document.createElement("div");
      section.append(
        paragraph(
          `Source page ${integer(provenance["page"])} / box ${JSON.stringify(provenance["bbox"])} / ${text(block["source_block_id"])}`,
        ),
      );
      if (block["warning"] !== null) {
        const warning = object(block["warning"]);
        section.className = "notice";
        section.append(
          paragraph(text(warning["severity"]).toUpperCase(), "badge"),
          paragraph("Condition: " + text(warning["condition"]), ""),
          paragraph("Consequence: " + text(warning["consequence"]), ""),
          paragraph("Avoidance: " + text(warning["avoidance"]), ""),
        );
      } else if (block["kind"] === "table") {
        const region = document.createElement("div");
        region.className = "scroll";
        region.tabIndex = 0;
        region.setAttribute("role", "region");
        region.setAttribute("aria-label", "Canonical source table");
        const table = document.createElement("table");
        const rows = list(block["table_rows"]);
        rows.forEach((raw, index) => {
          const tr = document.createElement("tr");
          for (const cell of list(raw)) {
            const element = document.createElement(index === 0 ? "th" : "td");
            element.textContent = text(cell);
            if (element instanceof HTMLTableCellElement && index === 0)
              element.scope = "col";
            tr.append(element);
          }
          table.append(tr);
        });
        region.append(table);
        section.append(region);
      } else section.append(paragraph(text(block["text"]), ""));
      article.append(section);
    }
    node("topics").append(article);
  }
}
async function loadDetail(epoch: number): Promise<void> {
  const identifier = selectedBuild;
  if (identifier === null) return;
  const value = object(
    await api(
      "/api/detail?" +
        new URLSearchParams({
          id: identifier,
          q: input("topic-search").value,
          source: select("topic-source").value,
          kind: select("topic-kind").value,
        }),
    ),
  );
  if (epoch !== reviewEpoch || selectedBuild !== identifier) return;
  const record = object(value["build"]);
  if (id(record["id"]) !== identifier)
    throw new Error("Selected build identity changed in the response");
  selectedRecord = record;
  node("selected").textContent =
    `${text(record["title"])} / revision ${integer(record["revision"])} / ${identifier}`;
  const report = object(record["report"]);
  const metrics = document.createElement("div");
  metrics.className = "metric-row";
  metrics.append(
    metric("Outcome", record["status"]),
    metric("Registered sources", report["source_count"]),
    metric("Topics", report["topic_count"]),
    metric("Errors", object(report["issue_counts"])["error"] ?? 0),
  );
  node("build-summary").replaceChildren(metrics);
  for (const issueValue of list(report["issues"])) {
    const issue = object(issueValue);
    const message = paragraph(
      `${text(issue["severity"]).toUpperCase()} / ${text(issue["code"])}: ${text(issue["message"])}`,
      "notice",
    );
    node("build-summary").append(message);
  }
  node("evidence").textContent = pretty(record);
  options(
    select("topic-source"),
    list(value["sources"]).map((source) => ({
      value: text(source),
      label: text(source),
    })),
    "All sources",
  );
  const artifacts = list(value["artifacts"]).map(text);
  options(
    select("artifact-path"),
    artifacts.map((path) => ({ value: path, label: path })),
  );
  options(
    select("preview-path"),
    artifacts
      .filter((path) => path.endsWith(".html"))
      .map((path) => ({ value: path, label: path })),
  );
  if (
    select("preview-path").value === "" ||
    !node("preview").hasAttribute("src")
  )
    select("preview-path").value =
      report["publication_allowed"] === true
        ? "site/index.html"
        : "reports/migration-report.html";
  renderTopics(value);
  refreshControls();
}
async function chooseBuild(identifier: string): Promise<void> {
  selectedBuild = identifier;
  selectedRecord = null;
  input("topic-search").value = "";
  select("topic-kind").value = "";
  select("topic-source").value = "";
  select("preview-path").replaceChildren();
  const frame = node("preview");
  if (frame instanceof HTMLIFrameElement) {
    frame.hidden = true;
    frame.removeAttribute("src");
  }
  await loadDetail(++reviewEpoch);
  status(
    "Loaded exact retained evidence. Inspect the original findings, citations and formatting before sharing.",
  );
}
function clearBuild(): void {
  selectedBuild = null;
  selectedRecord = null;
  reviewEpoch++;
  node("selected").textContent = "Choose a saved build.";
  node("build-summary").replaceChildren();
  node("topics").replaceChildren();
  node("evidence").textContent = "";
  node("topic-count").textContent = "No selected build.";
  select("artifact-path").replaceChildren();
  select("preview-path").replaceChildren();
  options(select("topic-source"), [], "All sources");
  const frame = node("preview");
  if (frame instanceof HTMLIFrameElement) {
    frame.hidden = true;
    frame.removeAttribute("src");
  }
  refreshControls();
}

bind("editor", "input", () => {
  draft.edit++;
  draft.dirty = true;
  refreshControls();
});
bind("new-project", "click", () => {
  applyDraft(blank());
  status("New unsaved draft. Existing projects and builds were retained.");
});
bind("refresh-projects", "click", refresh);
bind("refresh-builds", "click", refresh);
bind("validate", "click", () =>
  owned(async () => {
    const captured = capture(draft);
    const response = object(
      await api("/api/validate", { input: editor.value }),
    );
    if (!unchanged(draft, captured)) {
      status(
        "The captured fields were validated, but the editor changed. Validate the current draft again.",
      );
      return;
    }
    node("validation").textContent =
      `${integer(response["source_count"])} source declarations / ${integer(response["unique_pdfs"])} unique PDFs / ${integer(response["bytes"])} bytes. Fields and references are valid; no PDF build was run.`;
    status(
      "Structured fields and exact uploaded references are valid. Save, then build the actual PDFs.",
    );
  }),
);
bind("save", "click", () =>
  owned(async () => {
    const captured = capture(draft);
    const saved = project(
      await api("/api/save", {
        id: draft.id,
        revision: draft.revision,
        input: editor.value,
      }),
    );
    const replaceEditor = unchanged(draft, captured);
    draft = savedState(draft, captured, saved);
    if (replaceEditor) editor.value = pretty(saved.input);
    refreshControls();
    await refresh();
    status(
      sameContext(draft, captured)
        ? `Saved actual revision ${saved.revision}.${draft.dirty ? " Current editor changes remain unsaved." : " Build this saved revision when ready."}`
        : "Saved the captured snapshot in history; the current draft selection was not replaced.",
    );
  }),
);
bind("build", "click", () =>
  owned(async () => {
    if (draft.id === null || draft.dirty)
      throw new Error(
        "Save the current draft before building an explicit revision",
      );
    const captured = capture(draft);
    status(
      "Running the original PDF engine on the exact saved snapshot. Work is bounded; technical review remains required.",
    );
    const record = object(
      await api("/api/build", { id: draft.id, revision: draft.revision }),
    );
    await refresh();
    if (unchanged(draft, captured)) await chooseBuild(id(record["id"]));
    else
      status(
        `Actual build ${id(record["id"])} was retained. The editor/selection changed; choose that build explicitly in history.`,
      );
  }),
);
bind("source-form", "submit", (event) => {
  event.preventDefault();
  return owned(async () => {
    const captured = capture(draft);
    const result = object(
      await api("/api/append-source", {
        input: editor.value,
        sha256: select("source-pdf").value,
        pin_checksum: input("pin-checksum").checked,
        metadata: {
          source_id: input("source-id").value,
          revision: input("source-revision").value,
          product_model: input("source-model").value,
          owner: input("source-owner").value,
          license: input("source-license").value,
          migration_status: select("source-state").value,
        },
      }),
    );
    if (!unchanged(draft, captured)) {
      status(
        "The source declaration was checked, but the editor changed; no stale declaration was applied.",
      );
      return;
    }
    editor.value = pretty(object(result["input"]));
    draft.edit++;
    draft.dirty = true;
    input("source-id").value =
      "source-" +
      (list(object(object(result["input"])["registry"])["sources"]).length + 1);
    status(
      "Added the source declaration to this draft. Validate and Save before building.",
    );
  });
});
bind("pdf-file", "change", () =>
  owned(async () => {
    const file = input("pdf-file").files?.[0];
    if (!file) return;
    validFileSize(file.size, 8 * 1024 * 1024);
    const response = object(
      await api("/api/upload", {
        name: file.name,
        base64: base64(new Uint8Array(await file.arrayBuffer())),
      }),
    );
    await refresh();
    status(
      `Source bytes are available in this library: ${text(response["sha256"])}. Add a declaration to include them in a project.`,
    );
    input("pdf-file").value = "";
  }),
);
bind("create-example", "click", () =>
  owned(async () => {
    const captured = capture(draft);
    const saved = project(
      await api("/api/example", { name: select("example").value }),
    );
    await refresh();
    if (unchanged(draft, captured)) applyDraft(saved.input, saved);
    status(
      "Created a real editable project from original synthetic source PDFs. Build it or change its actual input first.",
    );
  }),
);
bind("import-project", "change", () =>
  owned(async () => {
    const file = input("import-project").files?.[0];
    if (!file) return;
    validFileSize(file.size, 48 * 1024 * 1024);
    const captured = capture(draft);
    const saved = project(
      await api(
        "/api/import",
        fileText(new Uint8Array(await file.arrayBuffer())),
      ),
    );
    await refresh();
    if (unchanged(draft, captured)) applyDraft(saved.input, saved);
    status(
      "Imported actual source bytes/settings as a new saved project. Prior reports were not adopted; choose Build to process it.",
    );
    input("import-project").value = "";
  }),
);
bind("export-project", "click", async () => {
  if (draft.id === null || draft.dirty)
    throw new Error(
      "Save the current draft before exporting its exact revision",
    );
  await download(
    "/api/export-project?" +
      new URLSearchParams({ id: draft.id, revision: String(draft.revision) }),
    "foundry-project-" + draft.id + ".json",
  );
});
bind("delete-project", "click", () =>
  owned(async () => {
    if (
      draft.id === null ||
      !confirm(
        "Remove only this saved project? Existing builds and PDFs remain. Export first.",
      )
    )
      return;
    const captured = capture(draft);
    await api("/api/delete-project", {
      id: draft.id,
      revision: draft.revision,
    });
    if (sameContext(draft, captured)) applyDraft(blank());
    await refresh();
    status(
      "Removed only the explicitly selected project. Immutable builds and source bytes remain.",
    );
  }),
);
bind("find-topics", "click", () => loadDetail(++reviewEpoch));
bind("show-preview", "click", async () => {
  const identifier = selectedBuild;
  const path = select("preview-path").value;
  if (identifier === null || !path)
    throw new Error("Choose an actual HTML artifact from a saved build");
  await api("/api/preview-session", { purpose: "preview" });
  if (selectedBuild !== identifier || select("preview-path").value !== path)
    return;
  const frame = node("preview");
  if (!(frame instanceof HTMLIFrameElement))
    throw new Error("Preview frame is absent");
  frame.hidden = false;
  frame.src =
    "/preview/" +
    identifier +
    "/" +
    path.split("/").map(encodeURIComponent).join("/");
});
for (const [control, kind] of [
  ["export-build", "zip"],
  ["export-evidence", "evidence"],
] as const)
  bind(control, "click", async () => {
    if (selectedBuild === null) throw new Error("Choose a saved build");
    const identifier = selectedBuild;
    await download(
      "/api/export-build?" + new URLSearchParams({ id: identifier, kind }),
      "foundry-" + identifier + (kind === "zip" ? ".zip" : ".json"),
    );
  });
bind("download-artifact", "click", async () => {
  if (selectedBuild === null) throw new Error("Choose a saved build");
  const path = select("artifact-path").value;
  await download(
    "/api/artifact?" + new URLSearchParams({ id: selectedBuild, path }),
    "foundry-" + (path.split("/").at(-1) ?? "artifact"),
  );
});
bind("use-input", "click", () => {
  if (selectedRecord === null) throw new Error("Choose a saved build");
  applyDraft(object(selectedRecord["input"]));
  status(
    "Copied this actual build input into a new unsaved draft; old records were not changed.",
  );
});
bind("delete-build", "click", () =>
  owned(async () => {
    const identifier = selectedBuild;
    if (
      identifier === null ||
      !confirm(
        "Delete only this immutable build? Download its evidence first; projects and PDFs remain.",
      )
    )
      return;
    await api("/api/delete-build", { id: identifier });
    if (selectedBuild === identifier) clearBuild();
    await refresh();
    status(
      "Deleted only the selected build. Other evidence, projects and PDFs remain.",
    );
  }),
);
bind("compare-builds", "click", () =>
  owned(async () => {
    const before = select("before-build").value;
    const after = select("after-build").value;
    if (!before || !after)
      throw new Error("Choose two actual saved corpora to compare");
    const epoch = ++comparisonEpoch;
    const value = object(await api("/api/compare", { before, after }));
    if (
      epoch !== comparisonEpoch ||
      select("before-build").value !== before ||
      select("after-build").value !== after
    ) {
      status(
        "The actual comparison completed, but the selection changed. Generate the current comparison explicitly.",
      );
      return;
    }
    comparison = value;
    const report = object(value["report"]);
    const counts = object(report["counts"]);
    const metrics = document.createElement("div");
    metrics.className = "metric-row";
    for (const name of ["added", "removed", "changed", "unchanged"])
      metrics.append(metric(name, counts[name]));
    node("comparison-summary").replaceChildren(metrics);
    node("comparison").replaceChildren();
    for (const item of list(report["changes"])) {
      const change = object(item);
      const details = document.createElement("details");
      const summary = document.createElement("summary");
      summary.textContent = `${text(change["status"])} / ${text(change["source_id"])} / ${text(change["title"])}${change["safety_review_required"] === true ? " / safety review required" : ""}`;
      const evidence = document.createElement("pre");
      evidence.tabIndex = 0;
      evidence.setAttribute("role", "region");
      evidence.setAttribute("aria-label", "Before and after source citations");
      evidence.textContent = pretty(change);
      details.append(summary, evidence);
      node("comparison").append(details);
    }
    button("export-comparison-json").disabled = false;
    button("export-comparison-html").disabled = false;
    status(
      "Generated the original cited comparison. Export it or regenerate it from these retained builds; no release was approved.",
    );
  }),
);
for (const control of ["before-build", "after-build"])
  bind(control, "change", () => {
    comparisonEpoch++;
    comparison = null;
    node("comparison").replaceChildren();
    node("comparison-summary").replaceChildren();
    button("export-comparison-json").disabled = true;
    button("export-comparison-html").disabled = true;
  });
for (const kind of ["json", "html"] as const)
  bind("export-comparison-" + kind, "click", () => {
    if (comparison === null)
      throw new Error("Generate an actual comparison first");
    blobDownload(
      new Blob([text(comparison[kind])], {
        type: kind === "json" ? "application/json" : "text/html",
      }),
      "foundry-revision-review." + kind,
    );
  });
bind("quit", "click", async () => {
  await api("/api/quit", { confirm: true });
  status(
    "Close requested. The native owner stays open while accepted work drains; wait for its actual exit.",
  );
  button("quit").disabled = true;
});

async function start(): Promise<void> {
  if (
    location.protocol !== "http:" ||
    location.hostname !== "127.0.0.1" ||
    !/^[a-zA-Z0-9_-]{32,100}$/u.test(token)
  )
    throw new Error(
      "Open this application from its native owner window; a local HTML file has no workspace authority",
    );
  const response = await fetch("/health", { cache: "no-store" });
  const health = object((await response.json()) as Json);
  const identity = object(health["identity"]);
  node("identity").textContent =
    `${text(identity["product"])} / version ${text(identity["version"])} / source ${text(identity["sourceCommit"])} / created by Jason Stys`;
  applyDraft(blank());
  await refresh();
  status(
    "Owned application ready. Upload your PDFs and author a source registry, or create an editable reference project.",
  );
}
void start().catch(failure);
