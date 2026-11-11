/** File: Exercise the actual editable Foundry app and original PDF engine as a user, by Jason Stys.
 * Native invocation is source-bound; the explicit source runner is labelled development.
 * Every response is real. No account, remote document or mocked API is used. See docs/file-reference.md. */
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { chromium } from "../web/node_modules/playwright-core/index.mjs";
import AxeBuilder from "../web/node_modules/@axe-core/playwright/dist/index.mjs";

const [url, directory, expectedSource] = process.argv.slice(2);
assert(
  url &&
    directory &&
    (expectedSource === "development" ||
      /^[a-f0-9]{40}$/u.test(expectedSource ?? "")),
);
const output = resolve(directory);
const fixture = JSON.parse(
  await readFile(resolve(output, "inputs.json"), "utf8"),
);
const original = Buffer.from(fixture.original, "base64");
const custom = Buffer.from(fixture.custom, "base64");
const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width: 1280, height: 960 },
  acceptDownloads: true,
});
const page = await context.newPage();
page.setDefaultTimeout(15000);
page.setDefaultNavigationTimeout(15000);
await page
  .context()
  .tracing.start({ screenshots: true, snapshots: true, sources: false });
const errors = [],
  external = [],
  records = [];
const authority = new URL(url).origin;
page.on("pageerror", (error) => errors.push(error.message));
page.on("request", (request) => {
  if (
    new URL(request.url()).origin !== authority &&
    !request.url().startsWith("blob:")
  )
    external.push(request.url());
});

async function responseAction(control, path, expected, input = undefined) {
  const waiting = page.waitForResponse(
    (response) =>
      new URL(response.url()).pathname === path &&
      response.request().method() === "POST",
    { timeout: 65000 },
  );
  if (input) await page.locator(control).setInputFiles(input);
  else await page.locator(control).click();
  const response = await waiting;
  assert.equal(response.status(), expected, await response.text());
  return response.json();
}
async function check(selector, phrase) {
  await page
    .locator(selector)
    .filter({ hasText: phrase })
    .waitFor({ timeout: 15000 });
}
async function download(selector) {
  const waiting = page.waitForEvent("download", { timeout: 10000 });
  await page.locator(selector).click();
  const artifact = await waiting,
    stream = await artifact.createReadStream();
  assert(stream);
  const pieces = [];
  let bytes = 0;
  for await (const part of stream) {
    bytes += part.length;
    assert(bytes <= 64 * 1024 * 1024);
    pieces.push(part);
  }
  return Buffer.concat(pieces);
}
async function draft() {
  return JSON.parse(await page.locator("#editor").inputValue());
}
async function fillDraft(value) {
  await page.locator("#editor").fill(JSON.stringify(value, null, 2));
}
async function capturedSave(interact) {
  let admitted, refused, release;
  const received = new Promise((resolve, reject) => {
    admitted = resolve;
    refused = reject;
  });
  const gate = new Promise((resolve) => {
    release = resolve;
  });
  const timer = setTimeout(
    () =>
      refused(
        new Error("Actual held save response was not received within15s"),
      ),
    15000,
  );
  await page.route(
    "**/api/save",
    async (route) => {
      try {
        const response = await route.fetch();
        assert.equal(response.status(), 201);
        admitted(await response.json());
        await gate;
        await route.fulfill({ response });
      } catch (error) {
        refused(error);
        throw error;
      }
    },
    { times: 1 },
  );
  try {
    const finished = page.waitForResponse(
      (response) =>
        new URL(response.url()).pathname === "/api/save" &&
        response.request().method() === "POST",
    );
    await page.locator("#save").click();
    const record = await received;
    assert.equal(await page.locator("#save").isDisabled(), true);
    await interact(record);
    release();
    await finished;
    return record;
  } finally {
    clearTimeout(timer);
    release();
    await page.unroute("**/api/save");
  }
}
async function build() {
  const actual = await responseAction("#build", "/api/build", 201);
  await check("#selected", actual.id);
  assert.equal(actual.engine.sourceCommit, expectedSource);
  assert.equal(actual.engine.version, "0.2.0");
  assert.deepEqual(
    JSON.parse((await download("#export-evidence")).toString("utf8")),
    actual,
  );
  const archive = await download("#export-build");
  assert.equal(createHash("sha256").update(archive).digest("hex"), actual.sha);
  await writeFile(resolve(output, actual.id + ".zip"), archive);
  records.push({
    id: actual.id,
    revision: actual.revision,
    title: actual.title,
    status: actual.status,
    sha256: actual.sha,
    input: actual.input,
    report: actual.report,
  });
  return actual;
}
try {
  await page.goto(url);
  await check("#status", "Owned application ready");
  console.log("Actual UI ready");
  assert.equal(await page.locator("#find-topics").isDisabled(), true);
  const emptyAccessibility = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
    .analyze();
  assert.deepEqual(emptyAccessibility.violations, []);
  await check("#identity", expectedSource);
  assert.equal(new URL(page.url()).hash, "");
  assert.equal(await page.locator("#build").isDisabled(), true);
  await responseAction("#pdf-file", "/api/upload", 201, {
    name: "Service calibration.pdf",
    mimeType: "application/pdf",
    buffer: original,
  });
  assert.deepEqual(
    await download("#library button:has-text('Download exact source PDF')"),
    original,
  );
  await page.locator("#source-pdf").selectOption(fixture.originalSha256);
  await page.locator("#source-id").fill("custom-calibration");
  await page.locator("#source-revision").fill("A");
  await page.locator("#source-model").fill("Synthetic service instrument");
  await page.locator("#source-owner").fill("Synthetic documentation team");
  await page.locator("#source-license").fill("MIT original synthetic fixture");
  await responseAction("#append-source", "/api/append-source", 200);
  const firstInput = await draft();
  firstInput.title = "Field service%_ <script>inert</script>";
  await fillDraft(firstInput);
  await responseAction("#validate", "/api/validate", 200);
  await check("#validation", `${original.length} bytes`);
  const firstSaved = await responseAction("#save", "/api/save", 201);
  assert.equal(firstSaved.revision, 1);
  const first = await build();
  console.log("First actual PDF and exact exports passed");
  assert.equal(first.status, "published");
  assert.equal(first.report.documents[0].page_count, 2);
  await check("#topics", "vent the port");
  await check("#topics", "Reference");
  await page.locator("#topic-search").fill("vent the port");
  await page.locator("#find-topics").click();
  await check("#topic-count", "Showing 1 of");
  await check("#topics", "Condition: port is pressurized");
  await page.locator("#topic-source").selectOption("custom-calibration");
  await page.locator("#topic-kind").selectOption("troubleshooting");
  await page.locator("#find-topics").click();
  await check("#topic-count", "Showing 0 of");
  await page.locator("#topic-kind").selectOption("");
  await page.locator("#topic-search").fill("");
  await page.locator("#find-topics").click();
  await page.locator("#preview-path").selectOption("site/index.html");
  await page.locator("#show-preview").click();
  await page
    .frameLocator("#preview")
    .getByRole("heading", { name: /^Migration build /u })
    .waitFor({ timeout: 10000 });
  assert.equal(
    await page.locator("#preview").getAttribute("sandbox"),
    "allow-same-origin",
  );
  await page.locator("#artifact-path").selectOption("canonical/topics.json");
  const canonical = JSON.parse(
    (await download("#download-artifact")).toString("utf8"),
  );
  assert.deepEqual(
    [
      ...new Set(
        canonical.flatMap((topic) =>
          topic.blocks.map((block) => block.provenance.page),
        ),
      ),
    ].sort(),
    [1, 2],
  );
  await page
    .locator("#selected-panel")
    .screenshot({ path: resolve(output, "01-actual-build-evidence.png") });
  const portable = await download("#export-project");
  const exported = JSON.parse(portable.toString("utf8"));
  assert.deepEqual(Buffer.from(exported.files[0].base64, "base64"), original);
  const copied = await responseAction("#import-project", "/api/import", 201, {
    name: "authored-project.json",
    mimeType: "application/json",
    buffer: portable,
  });
  assert.notEqual(copied.id, firstSaved.id);
  assert.equal((await draft()).title, firstInput.title);
  // A second actual PDF with independent changed values/notices exercises a real revision, not metadata-only output.
  await responseAction("#pdf-file", "/api/upload", 201, {
    name: "Revised calibration.pdf",
    mimeType: "application/pdf",
    buffer: custom,
  });
  const revised = await draft();
  revised.title = "Revised service manual";
  revised.registry.sources[0] = {
    ...revised.registry.sources[0],
    revision: "B",
    path: "sources/" + fixture.customSha256 + ".pdf",
    sha256: fixture.customSha256,
  };
  await fillDraft(revised);
  assert.equal(await page.locator("#build").isDisabled(), true);
  await responseAction("#save", "/api/save", 201);
  const second = await build();
  assert.equal(second.status, "published");
  await check("#topics", "2.5 bar");
  await check("#topics", "disconnect power");
  await page.locator("#before-build").selectOption(first.id);
  await page.locator("#after-build").selectOption(second.id);
  const compared = await responseAction("#compare-builds", "/api/compare", 200);
  console.log("Revised actual PDF and safety comparison passed");
  assert(
    compared.report.counts.changed +
      compared.report.counts.removed +
      compared.report.counts.added >
      0,
  );
  assert(
    compared.report.changes.some(
      (change) => change.safety_review_required === true,
    ),
  );
  assert.deepEqual(
    JSON.parse((await download("#export-comparison-json")).toString("utf8")),
    compared.report,
  );
  assert(
    (await download("#export-comparison-html")).includes(
      Buffer.from("Safety review required"),
    ),
  );
  await page
    .locator("#comparison-summary")
    .screenshot({ path: resolve(output, "02-actual-revision-review.png") });
  await page.locator("#before-build").selectOption(second.id);
  assert.equal(
    await page.locator("#export-comparison-json").isDisabled(),
    true,
  );
  // A wrong declared expected checksum blocks publication without inventing a site.
  const blockedInput = await draft();
  blockedInput.registry.sources[0].sha256 = "0".repeat(64);
  await fillDraft(blockedInput);
  await responseAction("#save", "/api/save", 201);
  const blocked = await build();
  assert.equal(blocked.status, "blocked");
  assert(blocked.report.issue_counts.error > 0);
  assert(
    !(await page.locator("#preview-path option").allTextContents()).includes(
      "site/index.html",
    ),
  );
  await page.locator("#build-status").selectOption("blocked");
  await page.locator("#refresh-builds").click();
  await check("#builds", blocked.id);
  await page.waitForFunction(
    () => document.querySelectorAll("#builds li").length === 1,
    null,
    { timeout: 10000 },
  );
  assert.equal(await page.locator("#builds li").count(), 1);
  // Raw duplicate fields must reach the backend; client JSON.parse must never hide the ambiguity.
  await page
    .locator("#editor")
    .fill('{"title":"one","title":"two","registry":{},"limits":{}}');
  await responseAction("#validate", "/api/validate", 400);
  await check("#error", "Duplicate");
  console.log("Blocked build, filtering and actual duplicate-key error passed");
  await page.locator("#new-project").click();
  assert.equal((await draft()).registry.sources.length, 0);
  await page.locator("#project-search").fill("%_");
  await page.locator("#refresh-projects").click();
  await check("#projects", firstSaved.id);
  await page.waitForFunction(
    () => document.querySelectorAll("#projects li").length === 1,
    null,
    { timeout: 10000 },
  );
  assert.equal(await page.locator("#projects li").count(), 1);
  await page
    .locator("#projects li")
    .filter({ hasText: firstSaved.id })
    .locator("button")
    .click();
  await check("#draft-state", firstSaved.id);
  const capturedInput = await draft();
  capturedInput.title = "Captured source snapshot%_";
  await fillDraft(capturedInput);
  const late = await capturedSave(async () => {
    await page.locator("#new-project").click();
    assert.equal((await draft()).registry.sources.length, 0);
  });
  assert.equal(late.id, firstSaved.id);
  assert.equal(late.revision, 2);
  await check("#status", "current draft selection was not replaced");
  assert.equal((await draft()).registry.sources.length, 0);
  await check("#draft-state", "New unsaved draft");
  await page
    .locator("#projects li")
    .filter({ hasText: firstSaved.id })
    .locator("button")
    .click();
  await check("#draft-state", "revision 2");
  const thirdInput = await draft();
  thirdInput.title = "Saved in-flight source%_";
  await fillDraft(thirdInput);
  const typed = await capturedSave(async () => {
    const unsaved = await draft();
    unsaved.title = "My still-unsaved text";
    await fillDraft(unsaved);
  });
  assert.equal(typed.revision, 3);
  await check("#draft-state", "revision 3 / unsaved edits");
  assert.equal((await draft()).title, "My still-unsaved text");
  assert.equal(await page.locator("#build").isDisabled(), true);
  console.log("Real captured save/context and in-flight typing guards passed");
  assert.equal(await page.locator("script:not([src])").count(), 0);
  await page.setViewportSize({ width: 320, height: 900 });
  const geometry = await page.evaluate(() => ({
    width: innerWidth,
    scrollWidth: document.documentElement.scrollWidth,
    overflowing: [...document.querySelectorAll("body *")]
      .filter((item) => {
        const box = item.getBoundingClientRect();
        return box.width && (box.right > innerWidth || box.left < 0);
      })
      .slice(0, 24)
      .map((item) => ({
        tag: item.tagName,
        id: item.id,
        class: item.className,
        width: item.getBoundingClientRect().width,
        right: item.getBoundingClientRect().right,
      })),
  }));
  assert.equal(
    geometry.scrollWidth <= geometry.width,
    true,
    JSON.stringify(geometry),
  );
  console.log("Mobile geometry passed; evaluating actual Axe accessibility");
  const accessibility = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
    .analyze();
  assert.deepEqual(
    accessibility.violations.map((item) => ({
      id: item.id,
      nodes: item.nodes.map((node) => node.target),
    })),
    [],
  );
  assert.deepEqual(errors, []);
  assert.deepEqual(external, []);
  console.log("Actual Axe accessibility passed");
  await writeFile(
    resolve(output, "browser-acceptance.json"),
    JSON.stringify(
      {
        passed: true,
        sourceCommit: expectedSource,
        version: "0.2.0",
        browser: "actual Chromium",
        records,
        originalProject: firstSaved.id,
        importedProject: copied.id,
        independentOracles: [
          "2 source pages",
          "original ruled table and complete caution",
          "actual replacement PDF 2.5bar and disconnect-power notice",
          "safety review change",
          "wrong checksum blocks site",
          "exact export hashes",
          "literal filters",
          "duplicate fields refused",
          "320px no page overflow",
          "Axe WCAG22AA",
        ],
        pageErrors: errors,
        externalRequests: external,
      },
      null,
      2,
    ) + "\n",
  );
  await responseAction("#quit", "/api/quit", 200);
} finally {
  await page
    .context()
    .tracing.stop({ path: resolve(output, "actual-browser-trace.zip") });
  await browser.close();
}
