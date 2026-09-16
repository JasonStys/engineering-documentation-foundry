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
| `.github/dependabot.yml` | Weekly Python and GitHub Actions update checks. |
