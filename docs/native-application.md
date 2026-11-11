# Use the actual local application

Created by Jason Stys. Source/support: [Engineering Documentation Foundry](https://github.com/JasonStys/engineering-documentation-foundry).

## Start and choose a workspace

The [published 0.2.0 release](https://github.com/JasonStys/engineering-documentation-foundry/releases/tag/v0.2.0)
contains a **Windows AMD64 portable ZIP**, not an installer transaction. Download its ZIP and
SHA-256 sidecar, verify the digest, extract the complete archive into a fresh directory and launch
`EngineeringDocumentationFoundry.exe`. Keep all adjacent resources and notices together. The
package is unsigned, and a supported Microsoft Visual C++ runtime is required. Normal OS warnings
and access rules still apply. Linux/macOS native packages passed hosted validation but are not
public download assets in this release.

The [four-page illustrated guide](reports/windows-application-guide-0.2.0.docx) and
[installed validation](reports/installed-windows-0.2.0-2026-11-11.md) record independent download,
real PDF workflows, retained history and normal exits at exact runtime source
`fa0cf1a0132e56e2b0016207b3d5aecd08a29c2a`. Shortcut-target verification is separate from ordinary
default-profile icon activation and OS browser opening, which were not independently exercised.

On first launch, the real setup dialog displays the exact official PyMuPDF wheel, size, digest,
ABI, provider and licensing information. Choose **Install verified PDF engine** or **Cancel without
opening documents**. Read the [AGPL/commercial dependency terms and technical setup boundary](PDF_ENGINE_SETUP.md).
Only that dependency is fetched; your PDFs are not sent. After verified setup, ordinary work is
offline. A failed or changed installation is preserved/refused, rather than silently repaired.
The normal OS-user dependency path is deliberately separate from documents. Very long custom
Windows paths can exceed the external extension loader's limits; use the normal per-user location.

Choose an empty folder or a matching existing workspace in the native window and click **Open
workspace**. No default credentials are needed: this is one trusted OS user's local data, with no
multiuser identity service. Unknown directories, linked recovery files and application installation
trees are refused before mutation. **Open browser** opens only this instance's fresh local address.

## Author, build and inspect your documents

1. In **PDF library**, add a local text-based PDF within 8 MiB. Its actual SHA-256 identity appears;
   duplicate bytes share one library entry. **Download exact source PDF** returns the original bytes.
2. In **Add a source declaration**, select the upload and enter a stable lowercase source ID,
   revision, product/model, responsible team and license/permission. Checksum pinning is explicit.
   Declared workflow status is metadata and cannot approve a publication. Add the declaration.
3. Edit **Project input JSON** to name the project, order/remove declarations or set page/block and
   heading thresholds. The backend preserves duplicate-field detection. Validate fields/references
   first; this does not process PDFs. Save a snapshot, then **Build saved revision**.
4. Inspect the outcome, issues, original engine diagnostics and cited canonical topics. Search text,
   values or notice fields and filter by source/type. Tables remain tables; every canonical block
   retains source revision, page, bounding box and original block ID. Inspect meaning yourself.
5. Choose an actual HTML artifact and open its sandboxed original preview. Generated scripts, forms,
   popups and external resources are blocked. Download the exact selected artifact, build evidence
   JSON or full artifact ZIP. A blocked build has reports/canonical data and **no published site**.

The source notices use the original explicit form, for example
`CAUTION: condition=port is pressurized; consequence=fluid release; avoidance=vent the port`.
Unrecognized/incomplete notices are findings, not guessed fields. Scanned PDFs need a separate
reviewed OCR workflow; this application does not supply OCR, image/equation understanding,
engineering truth verification or automatic unit conversions. Source values remain as written.

## Compare a revision and keep your work

Use the same stable source ID for a revised manual. Upload its real bytes, update its path/checksum
and revision, save a new snapshot and build. Select actual **Before** and **After** builds, then
generate the original cited revision review. It separates added/removed/changed/unchanged topics
and flags added, removed, changed or moved notices for human safety review. Download its exact
JSON/HTML; comparisons are not automatically saved as separate records but can be regenerated from
the selected retained builds. Changing either selection invalidates the earlier download buttons.

Projects and immutable builds are different records. Editing or removing a project never silently
rewrites a build. A stale saved revision is refused; review the current snapshot before retrying.
While a save is in flight, selecting another draft or typing more text does not allow the late
reply to overwrite that selection or discard the unsaved edits.

**Download saved project with PDFs** contains complete source bytes and settings. Importing this
file creates a new saved project and never adopts supplied output claims. Check confidentiality
before sharing it. Literal title/outcome filters locate retained projects/builds; canonical search
is scoped to the selected immutable build. Explicit removal affects only the selected record.
Referenced or active source bytes cannot be removed. The application never automatically prunes
history. Capacity errors explain when to export and explicitly remove unused data.

Optional calibration, pump-maintenance and eight-manual reference sets use the original synthetic
PDFs as editable inputs to the same engine. They are not precomputed report/demo applications.

## Exit, backup and source development

Closing the browser leaves the owner window running. Use **Quit application** or native **Exit** and
wait. The owner stays open while accepted requests and actual PDF work drain; a timer never turns
an active owner into a successful exit. After a normal close, copying the entire workspace
preserves its local plaintext database, source bytes and history. Protect that backup yourself.

For development, install only the reviewed per-project locks in an isolated environment:

```bash
python -m venv .venv
# Activate the environment normally for your OS.
python -m pip install --require-hashes -r requirements-dev.lock -r requirements-package.lock
python -m pip install --no-deps --no-build-isolation -e .
npm --prefix web ci --ignore-scripts
npm --prefix web run build
python launcher.py
```

The source CLI still supports Python 3.11–3.13; native freezing requires final Python 3.14.10 or a
later 3.14 patch. The explicit source GUI runner is `python tools/smoke_source.py --output
.runtime/source-check` (one command on one line). Native build/acceptance is
`python -m tools.package_app --output-root .runtime/clean-native-check` from a clean checkout.
Both choose new synthetic output/data paths and preserve failures. The native consumer executes
only the extracted binary, verifies exact identity, runs real browser flows, reopens its same
workspace and checks normal exit/listener closure. It does not claim a clean OS install.
