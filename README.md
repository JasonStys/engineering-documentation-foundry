# Engineering Documentation Foundry

[![CI](https://github.com/JasonStys/engineering-documentation-foundry/actions/workflows/ci.yml/badge.svg)](https://github.com/JasonStys/engineering-documentation-foundry/actions/workflows/ci.yml)
[![CodeQL](https://github.com/JasonStys/engineering-documentation-foundry/actions/workflows/codeql.yml/badge.svg)](https://github.com/JasonStys/engineering-documentation-foundry/actions/workflows/codeql.yml)
[![Python 3.11+](https://img.shields.io/badge/python-3.11%2B-3776AB.svg)](https://www.python.org/)
[![License: MIT](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

A deterministic Python pipeline that converts registered technical PDFs into validated,
provenance-linked canonical topics and an accessible static HTML site. It is a compact
demonstration of document engineering, defensive parsing, data contracts, test automation,
secure CI, and reviewable failure handling.

The **0.2.0 native application** adds a real local authoring workspace around that same engine:
upload your PDFs, declare their revisions and permissions, edit extraction limits, save an explicit
snapshot, build it, search cited canonical content, preview original formatting, download exact
artifacts and compare actual saved revisions. Projects, source bytes and immutable build evidence
survive a normal restart. Prepared manuals are optional editable inputs, rather than a separate demo.
The original CLI and deterministic publication gates remain available.

The [published 0.2.0 Windows portable application](https://github.com/JasonStys/engineering-documentation-foundry/releases/tag/v0.2.0)
passed independent download and installed synthetic-workspace acceptance, including three normal
exits and retained builds. Read the [illustrated application guide](docs/reports/windows-application-guide-0.2.0.docx),
[native usage](docs/native-application.md) and [current installed validation](docs/reports/installed-windows-0.2.0-2026-11-11.md).
The unsigned ZIP is not a signed installer or a clean-machine certification; Linux/macOS native
checks are recorded by [Desktop application validation](.github/workflows/desktop.yml).

The authored source is MIT licensed. The native archive excludes PyMuPDF/MuPDF binaries; first-run
setup explains their **AGPL v3 / Artifex commercial** licensing and asks Install or Cancel before any
workspace or document opens. Only the exact pinned official wheel is downloaded; later work is
offline. This technical setup design does not certify licensing compliance or supply a commercial
license. Read [PDF engine setup](docs/PDF_ENGINE_SETUP.md).

All example manuals are original synthetic fixtures. The pipeline does not call an AI model or
external service, so a source corpus can be rebuilt and audited offline.

The separate [CodeQL workflow](.github/workflows/codeql.yml) analyzes Python, TypeScript/JavaScript and GitHub Actions
with `security-extended` queries on main pushes, pull requests, weekly schedules and manual requests.
Findings are processed in GitHub's **Security → Code scanning** view. This static analysis complements
the existing parser, path-boundary, HTML-escaping, publication, revision-review and dependency tests;
it does not certify PDF safety or migrated technical meaning. See [the security model](docs/security-model.md#code-scanning)
and [validation record](docs/reports/codeql-2026-11-09.md).

## Why this project exists

PDFs preserve pages, but they are a poor source of truth for reusable web documentation. A
migration can silently reorder text, flatten tables, weaken warnings, or disconnect content from
its source. This project treats migration as a controlled build:

1. A registry declares the source, revision, owner, license, and optional SHA-256 digest.
2. A bounded extractor reads PDF text, tables, image placeholders, and page coordinates.
3. A normalizer creates stable concept, task, reference, or troubleshooting topics.
4. Validators block publication on semantic loss that can be detected automatically.
5. The build writes canonical JSON, JSON Lines provenance, quality reports, HTML, and a hash
   manifest through a temporary directory and atomic rename.

## Major features

- **Actual editable application:** upload and download exact source PDFs, author a source registry,
  validate fields separately from PDF processing and explicitly save/build a revision.
- **Durable review workspace:** literal title filters, outcome filters, canonical text/source/type
  search, exact HTML previews, complete project import/export and original cited revision comparison.
- **Honest transitions:** optimistic revision conflicts, stale-response protection while editing,
  no automatic history deletion and normal Exit that retains ownership until accepted work ends.
- **Deterministic builds:** timestamps are excluded from generated data; identical inputs create
  byte-identical artifacts.
- **Traceability:** every canonical block retains source ID, revision, page, bounding box, and
  extraction block ID.
- **Safety preservation:** notices require severity, condition, consequence, and avoidance. Missing
  fields are errors rather than guessed text.
- **Defensive boundaries:** relative-path enforcement, symlink containment, optional checksum
  verification, PDF-only input, file/page/block limits, and explicit overwrite behavior.
- **Accessible output:** semantic headings, real table headers, captions, labeled notices, keyboard
  focus styling, and visible image-review findings.
- **Inspectable failures:** blocked builds still commit canonical data, JSON/Markdown reports, and
  a manifest, but never publish the HTML site.
- **Revision review:** compare two canonical corpora before approval. A deterministic HTML/JSON
  dossier separates added, removed, changed and unchanged topics, distinguishes content edits from
  revision/provenance changes, and flags added, removed, changed or relocated safety notices with
  full before/after source citations. Existing publications are never modified.
- **Automated quality:** unit, property, integration, fault, repository-policy, and performance
  tests run alongside linting, formatting, type checking, packaging, and dependency audit.

## Quick start

For the graphical workflow and portable archive instructions, start with
[the native application guide](docs/native-application.md). For CLI development:

```bash
python -m venv .venv
# Linux/macOS: source .venv/bin/activate
# Windows PowerShell: .venv\Scripts\Activate.ps1
python -m pip install --require-hashes -r requirements-dev.lock
python -m pip install --no-deps --no-build-isolation -e .
docfoundry build examples/source-registry.yaml --output build/demo
```

Open `build/demo/site/index.html`. A successful reference build processes eight synthetic PDFs and
creates at least sixteen topics. Re-run an exact destination only with explicit consent; the tool
will replace only a directory containing its valid versioned build manifest:

```bash
docfoundry build examples/source-registry.yaml --output build/demo --overwrite
```

Exit code `0` means published, `2` means review artifacts were written but publication was blocked,
and `1` means configuration or operational failure.

## Review a documentation revision

Build the baseline and candidate into separate destinations, then compare their canonical files:

```bash
docfoundry compare build/baseline/canonical/topics.json build/candidate/canonical/topics.json \
  --output build/revision-review --fail-on-change
```

Open `build/revision-review/comparison.html` to read both versions, safety notices and source
coordinates; `comparison.json` contains the same machine-readable dossier. The output must be a
fresh directory with an existing parent. `--fail-on-change` returns `2` when any topic, revision or
provenance differs, enabling an explicit reviewer gate; without it a successful comparison returns
`0`. This does not approve a release or infer that changed instructions are safe. Renames appear as
removed/added topics, and blocked-build canonical data can be reviewed without publishing its site.
See [revision review](docs/revision-review.md) and [observed validation](docs/reports/practical-workflows-2026-11-09.md).

## Output contract

```text
build/demo/
|-- build-manifest.json
|-- canonical/
|   |-- topics.json
|   `-- trace.jsonl
|-- reports/
|   |-- migration-report.html
|   |-- migration-report.json
|   `-- migration-report.md
`-- site/
    |-- assets/site.css
    |-- index.html
    |-- reports/migration-report.html
    `-- topics/*.html
```

Error-severity findings replace `site/` with `PUBLICATION_BLOCKED.txt`. Warnings remain visible but
do not stop publication because they require human review rather than fabricated corrections.

## Code map

| File                            | Responsibility                                                                                 |
| ------------------------------- | ---------------------------------------------------------------------------------------------- |
| `src/docfoundry/models.py`      | Strict immutable Pydantic contracts for registries, extraction, topics, warnings, and reports. |
| `src/docfoundry/registry.py`    | Safe YAML/JSON loading, path containment, streaming hashes, and checksum enforcement.          |
| `src/docfoundry/extractor.py`   | Resource-bounded PyMuPDF extraction with text, table, image, and page-coordinate capture.      |
| `src/docfoundry/normalizer.py`  | Stable slugs, topic segmentation, content classification, and structured safety parsing.       |
| `src/docfoundry/validator.py`   | Duplicate, empty-topic, image-alt, table-header, and irregular-row quality checks.             |
| `src/docfoundry/reporting.py`   | Deterministic build IDs, coverage metrics, Markdown/JSON findings, and JSONL traces.           |
| `src/docfoundry/publisher.py`   | Autoescaped Jinja templates and accessible semantic HTML/CSS generation.                       |
| `src/docfoundry/pipeline.py`    | End-to-end orchestration, failure capture, manifests, safe overwrite, and atomic commit.       |
| `src/docfoundry/cli.py`         | Testable `build` command and stable process exit codes.                                        |
| `src/docfoundry/comparison.py` | Bounded strict corpus loading, deterministic revision comparison, cited HTML/JSON review and optional change gate. |
| `tools/generate_fixtures.py`    | Recreates the eight original synthetic reference PDFs.                                         |
| `tools/export_schemas.py`       | Exports public registry and migration-report JSON Schemas.                                     |
| `tools/update_symbol_index.py`  | Maintains line-accurate module symbol indexes in code headers.                                 |
| `examples/source-registry.yaml` | Complete reference-corpus registry and ownership metadata.                                     |
| `tests/`                        | Unit, property, integration, hostile-input, policy, and performance checks.                    |
| `.github/workflows/ci.yml`      | Least-privilege, commit-pinned continuous integration across supported Python versions.        |

The [complete file reference](docs/file-reference.md) summarizes every tracked file. Each Python
module also begins with a generated index of top-level classes, functions, and variables; each
function and class has its own docstring describing its contract and important values.

## Test and validation commands

```bash
ruff format --check .
ruff check .
mypy src
pytest --cov=docfoundry --cov-report=term-missing --cov-report=xml
python -m build
pip-audit
```

See the checked-in [test and validation report](docs/testing-and-validation.md) for the exact local
results and [architecture](docs/architecture.md) for stage invariants and complexity notes.

## Design boundaries

- The current release supports text-based PDFs with ruled tables; OCR is intentionally deferred.
- Image extraction creates a review placeholder because meaningful alternative text requires human
  technical judgment.
- Heuristic headings and topic types are visible, deterministic rules, not claims of perfect
  document understanding.
- Automated checks complement, but do not replace, engineering, legal, safety, or accessibility
  review.

## Documentation

- [User guide](docs/user-guide.md)
- [Architecture and data flow](docs/architecture.md)
- [Data contracts and invariants](docs/data-contracts.md)
- [Security and threat model](docs/security-model.md)
- [Accessibility decisions](docs/accessibility.md)
- [Testing and validation report](docs/testing-and-validation.md)
- [References](docs/references.md)
- [Architecture decision records](docs/adr/)
- [Latest maintenance audit](docs/reports/maintenance-audit-2026-09-18.md)

## License

Code and synthetic fixtures are available under the [MIT License](LICENSE).

## Documentation editions

Start with the [organized handbook](docs/handbook.md) for current usage, design, security and test guidance. Reviewed downloadable editions: [project-guide.docx](docs/reports/project-guide.docx) · [validation-review.docx](docs/reports/validation-review.docx) · [validation-evidence.xlsx](docs/reports/validation-evidence.xlsx).

[Publication identities and source scope](docs/reports/publications.json) · [Documentation validation record](docs/reports/documentation-refresh-2026-11-09.md). Historical results retain their own tested revision and date.

## Current Windows application guide

The published **0.2.0** edition documents real source uploads, saved registry revisions, original
publication artifacts and cited revision review in the installed application. Earlier Office
editions retain their historical baselines.

- [windows-application-guide-0.2.0.docx](docs/reports/windows-application-guide-0.2.0.docx): four illustrated pages with actual installed screenshots, user steps, immutable code and operating limits.
- [windows-application-guide-0.2.0.json](docs/reports/windows-application-guide-0.2.0.json): public release, document, screenshot, source and individually reviewed page identities.
- [installed-windows-0.2.0-2026-11-11.md](docs/reports/installed-windows-0.2.0-2026-11-11.md): measured independent download, installed workflows, native menu, data retention and validation scope.
