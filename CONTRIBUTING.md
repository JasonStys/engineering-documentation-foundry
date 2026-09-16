# Contributing

## Development setup

Create a Python 3.11 or newer virtual environment and install `.[dev]`. Keep changes focused and
add a failing test before a defect fix where practical.

## Definition of done

1. Public behavior and data contracts are documented.
2. New functions and classes have contract-focused docstrings.
3. Module symbol indexes are refreshed with `python tools/update_symbol_index.py`.
4. Formatting, linting, strict typing, tests, package build, and dependency audit pass.
5. Migration changes include success, fault, and idempotency evidence where applicable.
6. No source content is silently discarded and no safety meaning is invented.
7. Generated HTML is keyboard-usable and uses semantic structures.

## Local checks

```bash
ruff format .
python tools/update_symbol_index.py
ruff check .
mypy src
pytest --cov=docfoundry --cov-report=term-missing
python -m build
pip-audit
```

Commit generated schema changes when a public model changes. Fixture PDFs are source inputs; treat a
regeneration as a deliberate content revision.

## Review guidance

Review for correctness, failure behavior, bounded resource use, provenance preservation, security,
accessibility, and understandable maintenance cost. Big-O notation communicates growth, not a
substitute for measurement; performance claims require a reproducible benchmark and environment.
