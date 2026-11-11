# File reference

## Repository root

| File | Purpose |
|---|---|
| `README.md` | Project rationale, features, quick start, code map, commands, boundaries, and documentation index. |
| `pyproject.toml` | Package metadata, runtime/dev dependencies, CLI registration, and tool policy. |
| `LICENSE` | MIT license for code and synthetic fixtures. |
| `CONTRIBUTING.md` | Development workflow, definition of done, review rules, and commit guidance. |
| `SECURITY.md` | Private vulnerability-reporting guidance and supported-version policy. |
| `CHANGELOG.md` | User-visible release history. |
| `.gitattributes` | LF normalization for text and binary treatment for PDF fixtures. |
| `.gitignore` | Local environment, cache, coverage, package, and build exclusions. |

## Application modules

| File | Purpose |
|---|---|
| `src/docfoundry/__init__.py` | Package version and public package description. |
| `src/docfoundry/__main__.py` | `python -m docfoundry` entry point. |
| `src/docfoundry/cli.py` | Argument parsing, orchestration call, messages, and exit codes. |
| `src/docfoundry/models.py` | Immutable types, validation constraints, enums, and public contracts. |
| `src/docfoundry/registry.py` | Registry loading, containment, hashing, and checksum enforcement. |
| `src/docfoundry/extractor.py` | PyMuPDF block/table extraction and resource limits. |
| `src/docfoundry/normalizer.py` | Topic creation, slugging, classification, and warning parsing. |
| `src/docfoundry/validator.py` | Semantic/accessibility checks and publication decision. |
| `src/docfoundry/reporting.py` | Stable metrics, build identity, reports, canonical JSON, and provenance. |
| `src/docfoundry/publisher.py` | Autoescaped semantic HTML templates and CSS. |
| `src/docfoundry/pipeline.py` | Stage coordination, failure conversion, manifest, and atomic output. |

## Tools, schemas, and examples

| File | Purpose |
|---|---|
| `tools/generate_fixtures.py` | Generates eight two-page synthetic technical PDFs. |
| `tools/export_schemas.py` | Writes JSON Schema from public Pydantic models. |
| `tools/update_symbol_index.py` | Generates line-accurate module header indexes. |
| `schemas/source-registry.schema.json` | Machine-readable registry contract. |
| `schemas/migration-report.schema.json` | Machine-readable report contract. |
| `examples/source-registry.yaml` | Eight-source sample migration registry. |
| `examples/sources/*.pdf` | Original synthetic manuals exercising different documentation types. |

## Tests

| File | Purpose |
|---|---|
| `tests/conftest.py` | Validated model factories and shared repository path. |
| `tests/test_registry.py` | Registry formats, path defenses, digest checks, and uniqueness. |
| `tests/test_extractor.py` | Valid extraction and hostile/resource-bound failures. |
| `tests/test_normalizer.py` | Property-based slugs, segmentation, types, headings, and warnings. |
| `tests/test_validation_publishing.py` | Validators, escaping, semantic HTML, reports, and traces. |
| `tests/test_pipeline.py` | Full corpus, deterministic output, blocked runs, overwrite, and CLI. |
| `tests/test_performance.py` | End-to-end reference-corpus performance budget. |
| `tests/test_repository_quality.py` | Neutrality, docs, code headers/docstrings, and secure CI policy. |
| `tests/test_codeql_policy.py` | Actual three-language YAML analysis contract and unsafe semantic configuration mutations. |
| `tests/fixtures/malformed.pdf` | Intentionally invalid parser-failure input. |

## Project documentation and automation

| File | Purpose |
|---|---|
| `docs/architecture.md` | Data flow, stage contracts, complexity, determinism, and extensions. |
| `docs/user-guide.md` | Registry authoring, commands, finding interpretation, and review. |
| `docs/data-contracts.md` | Registry, extraction, canonical topic, warning, report, and trace invariants. |
| `docs/security-model.md` | Assets, boundaries, threats, controls, and residual risks. |
| `docs/accessibility.md` | Implemented semantic practices and required human checks. |
| `docs/testing-and-validation.md` | Verification scope, commands, environment, and recorded results. |
| `docs/references.md` | Primary technical and standards sources. |
| `docs/adr/0001-deterministic-static-pipeline.md` | Decision to use a deterministic static build architecture. |
| `.github/workflows/ci.yml` | Multi-version tests, lint, types, build, audit, and evidence upload. |
| `.github/workflows/codeql.yml` | Python/editor/Actions security-extended analysis, safe event triggers, bounded jobs and scoped SARIF upload. |
| `.github/dependabot.yml` | Weekly Python, editor npm and GitHub Actions update checks. |
# Revision review addition

`src/docfoundry/comparison.py` loads bounded canonical files, rejects ambiguous schemas/identities,
separates content/revision/provenance changes and writes escaped cited HTML/JSON review dossiers.
`tests/test_comparison.py` exercises real CLI/publication journeys and independent safety, schema,
determinism and hostile-input oracles. See [review workflow](revision-review.md).

## Reviewed documentation editions

| File | Purpose |
| --- | --- |
| `docs/handbook.md` | Organized usage, architecture, security and validation entry point. |
| `docs/reports/project-guide.docx` | Readable project and developer guide tied to the cited source. |
| `docs/reports/validation-review.docx` | Full-main static-analysis observations and separately dated local validation. |
| `docs/reports/validation-evidence.xlsx` | Filterable workflow and test-source Tables with recalculated outcome counts. |
| `docs/reports/publications.json` | Exact package hashes, approved page/tab identities and source/evidence baselines. |
| `docs/reports/documentation-refresh-2026-11-09.md` | Completed editorial/package checks and documentation interpretation limits. |

## Native authoring application

Every Python module includes a generated top-level declaration index in its header. Functions,
classes and controlled fixture callbacks have purpose docstrings; the editor files point here.
These are current source additions, separate from the historically hash-bound Office editions.

| File | Responsibility and important entry points |
| --- | --- |
| `launcher.py` | Fixed normal/worker dispatch; keeps upstream diagnostics separate from the exact worker protocol before parser import. |
| `src/foundry_desktop/contract.py` | Closed native project/limits, finite duplicate-safe JSON, hash-named PDFs and original SourceRegistry validation. |
| `src/foundry_desktop/private_io.py` | Actual regular-descriptor size/growth bounds. |
| `src/foundry_desktop/profile_paths.py` | Pre-mutation ancestor, link, program-tree and fixed SQLite recovery-member admission. |
| `src/foundry_desktop/profile.py` | Persistent product/schema marker, nonblocking OS lock and normal close. |
| `src/foundry_desktop/store.py` | Transactional exact source bytes, optimistic editable revisions, immutable builds, bounded capacity, atomic complete import and explicit removal. |
| `src/foundry_desktop/artifacts.py` | Complete original manifest/decision checks, deterministic ZIP and bounded stored-artifact reads. |
| `src/foundry_desktop/worker.py` | Original `run_pipeline` on fresh controlled hash-named input, including honest blocked publication. |
| `src/foundry_desktop/engine.py` | Fixed child invocation, bounded concurrent streams, finite execution and actual child/collector joins. |
| `src/foundry_desktop/service.py` | Authored validate/save/build/review actions, active-input protection, exact original comparison and one-build cache. |
| `src/foundry_desktop/server.py` | Owned ephemeral listener, exact authority/framing/capability, preview-only cookie, static CSP and accepted-handler drain. |
| `src/foundry_desktop/resources.py` | Exact product/source/runtime/static/example/pin identity and minimal fixed worker environment. |
| `src/foundry_desktop/parser_setup.py` | Official wheel pin/platform admission, bounded download/RECORD/tree/hash validation and atomic offline reuse. |
| `src/foundry_desktop/setup_window.py` | Explicit first-run dependency Install/Cancel before data access; actual installer-thread ownership. |
| `src/foundry_desktop/desktop.py` | Real native workspace/menu controls, safe error states and no timer-to-success Exit. |
| `src/foundry_desktop/resources/pymupdf-wheels.json` | Three exact official provider wheel identities, bytes and ABI tags. |
| `web/public/index.html` | Actual source editor, library/history, cited review, sandbox preview, comparison and help controls. |
| `web/src/app.ts` | Real API/user workflow, byte-preserving files, literal rendering and captured-context/filter epochs. |
| `web/src/model.ts` | Typed response/record, saved-state and file/encoding guards. |
| `web/src/styles.css` | Responsive readable evidence, focus states, mobile controls and named scroll regions. |
| `web/scripts/*.mjs` | Closed four-asset build/budget and actual locked-browser host checks. |
| `web/tests/model.test.ts` | Independent state/race/byte/response tests. |
| `tools/package_app.py` | Exact clean source, minimal locked freezing environment, real notices, parser/developer-module exclusion, safe archive and extracted acceptance. |
| `tools/runtime_notices.py` | Actual pinned runtime/build-compatibility terms and loaded Tcl/Tk notice bytes. |
| `tools/portable_archive.py` | Bounded conventional ZIP/tar, internal-link containment, fresh extraction and source metadata. |
| `tools/smoke_app.py` | Actual extracted executable, explicit setup, owned readiness, browser flows, retained history and accepted-publication normal drain. |
| `tools/native_feature_smoke.mjs` | Genuine editable PDFs/revision/blocked/export/search UI, real held-response editing races, mobile/Axe and exact screenshots. |
| `tools/smoke_source.py` | Explicit source-only invocation of the same user journey; never a native fallback. |
| `tests/test_desktop_core.py` | Actual original-engine source/citation/table/notice/determinism, transactions and complete import/export oracles. |
| `tests/test_desktop_http.py` | Actual owned HTTP authority/body, PDF build/preview/comparison/export and in-flight drain. |
| `tests/test_desktop_paths.py` | Actual Windows junction/POSIX alias, hardlink, program-tree and opened-identity refusals. |
| `tests/test_desktop_resources.py` | Independent runtime-floor/resource substitutions, data locations and capacity/corruption preservation. |
| `tests/test_desktop_window.py` | Genuine minimum-size Tk controls, startup/browser failure and repeated Exit ownership. |
| `tests/test_desktop_worker.py` | Actual original pipeline workers plus real inert timeout/stream/exit/protocol children and output-integrity negatives. |
| `tests/test_parser_setup.py` | Real independent inert wheels, ABI/RECORD/stream/tree/tamper/consent and offline verification oracles. |
| `tests/test_runtime_notices.py`, `tests/runtime_notice_cases.py` | Mandatory isolated execution of all thirteen actual Tcl/Tk notice contracts, without retries/skips. |
| `tests/test_portable_archive.py` | Real ZIP/tar path, duplicate, link, expansion and extraction fixtures; no member execution. |
| `tests/test_native_contract.py` | Version, real parser/developer-module exclusion and meaningful unsafe CI mutation negatives. |
| `requirements*.in`, `requirements*.lock` | Separate exact full-hash runtime, development and PyInstaller build graphs. |
| `.github/workflows/desktop.yml` | Three genuine extracted application consumers, no publication authority or binary uploads. |
| `docs/native-application.md` | Practical author/build/review/export/history/Exit workflows and supported boundaries. |
| `docs/PDF_ENGINE_SETUP.md` | Actual dependency licensing, consent, provider/import and offline verification boundaries. |
| `docs/releases/v0.2.0.md` | Current source candidate scope, without premature public release claims. |
| `docs/reports/native-application-2026-11-11.md` | Dated actual validation, observed failures/corrections and remaining proof limits. |
