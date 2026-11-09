# Corpus revision-review validation — 2026-11-09

Created by Jason Stys. Local Windows x64, Python 3.14.6, isolated declared development dependencies.
GitHub Actions were not triggered by this worker; the existing Python 3.11/3.12/3.13 matrix remains
the coordinated hosted acceptance gate.

The new reviewer workflow accepts two strict canonical corpora, compares stable source/topic
identities, emits deterministic cited JSON/HTML and can return a nonzero review-required exit code.
Content, revision labels and provenance changes remain distinct. Removed/changed/relocated notices
require explicit human review; no semantic rename or instruction-safety judgment is inferred.

| Validation | Observed result |
|---|---|
| Full regression/property/policy/performance suite | 37 passed, including 12 new comparison cases. |
| Branch-inclusive measured coverage | 95.65%, above the existing 90% gate; comparison module fully covered. |
| Final readable-table/notice regression subset | 12 passed after adding independent semantic-table and before/after notice assertions. |
| Ruff formatting/lint and strict mypy | Passed; 12 application source files typed. |
| Build distributions | Source distribution and wheel built successfully. |
| Dependency integrity/audit | `pip check` passed; no known dependency vulnerabilities. The editable project itself is not on PyPI. |
| Real corpus journey | Eight original synthetic PDFs produced 24 topics. An explicit candidate changed one cited notice/revision; comparison reported 1 changed and 23 unchanged, with review-required code 2. |
| Actual Chromium report use | Readable before/after safety notices and source citations visible at 390px; no horizontal overflow or external HTTP requests. Screenshot inspected locally. |

Independent checks cover notice removal/renames/duplicate titles across sources, revision-only
versus content/provenance edits, empty corpora, stable order/digests, malformed/duplicate-key/deep
JSON, invalid UTF-8, unknown fields, duplicate identities, actual byte/count bounds, escaped source
markup, no overwrite, CLI exit codes and genuine published/blocked PDF-build artifacts. The blocked
build never acquires a site. Both inputs remain byte-identical after review.

Reproduction:

```text
python -m ruff format --check .
python -m ruff check .
python -m mypy src
python -m pytest --cov=docfoundry --cov-branch --cov-report=term-missing --cov-report=xml
python -m build
python -m pip check
python -m pip_audit --local --progress-spinner off
```

Source maps were regenerated with `python tools/update_symbol_index.py`. The CLI enforces 16 MiB
and 10,000 topics per input; rendering/report size remains proportional to retained bounded source
content. Reports require a fresh output directory with an existing parent, and an I/O failure can
leave a partial review dossier without altering publications. Native installation and live/real
private corpora were not involved. No AI/provider calls were made. See [review interpretation and
limits](../revision-review.md).
