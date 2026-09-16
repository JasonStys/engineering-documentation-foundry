# Testing and validation report

## Scope

The verification suite covers contracts, path and checksum boundaries, PDF resource limits,
malformed files, topic segmentation, arbitrary Unicode slugs, structured warnings, table and image
quality rules, HTML escaping, deterministic reports, atomic output policy, blocked publication,
byte-for-byte repeatability, repository neutrality, source documentation, workflow pinning, and a
generous performance ceiling.

## Environment

- Platform: Windows
- Python: 3.12.14 locally; CI covers 3.11, 3.12, and 3.13
- Reference corpus: eight original synthetic PDFs, sixteen pages total

## Recorded results

Recorded on 2026-09-16 from the final clean release-candidate run.

| Check | Result |
|---|---|
| Ruff format | Pass; all 35 Python files formatted |
| Ruff lint | Pass; no findings |
| mypy strict typing | Pass; 11 application modules checked |
| pytest and branch coverage | Pass; 25 tests, 95.00% combined statement/branch coverage |
| wheel and source distribution | Pass; wheel and `.tar.gz` built in isolated environments |
| dependency vulnerability audit | Pass; no known vulnerabilities in auditable installed packages |
| reference build and byte-repeatability | Pass; independent output trees were byte-identical |
| performance budget | Pass; 0.861 seconds locally against a 20-second CI-safe ceiling |

The reference build produced build ID `build-ea3440494498`: eight sources, 24 topics, zero
errors, zero warnings, and 32 manifest-tracked artifacts. The local project package itself was
correctly skipped by the vulnerability service because version 0.1.0 is not published to PyPI.

Visual verification covered every page of all eight source PDFs and browser-rendered index, topic,
table, safety-notice, and quality-report views. The published report link and stylesheet returned
successfully from a local static server.

## Validation interpretation

A green automated run means the checked contracts and properties held for the versioned fixtures.
It does not certify migrated engineering meaning. The release checklist still requires a reviewer
to inspect procedures, units, warnings, figures, table relationships, and accessibility in context.

## Reproduce

```bash
ruff format --check .
ruff check .
mypy src
pytest --cov=docfoundry --cov-report=term-missing --cov-report=xml
python -m build
pip-audit
docfoundry build examples/source-registry.yaml --output build/reference
```
