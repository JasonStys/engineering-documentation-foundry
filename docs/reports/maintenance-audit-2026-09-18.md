# Maintenance audit — 2026-09-18

## Result

The validated source baseline was `5b6efa3`. The hosted [CI run](https://github.com/JasonStys/engineering-documentation-foundry/actions/runs/35386419240) passed on Python 3.11, 3.12, and 3.13.

## Verification scope

- Formatting, linting, strict type checks, unit/property tests, branch coverage, package build, and dependency audit ran in CI.
- Compatible updates to checkout, Python setup, mypy, pytest-cov, and ReportLab constraints were reviewed and merged.
- The pytest-cov and ReportLab constraint changes were conflict-resolved together and revalidated before merge.
- No open pull request or non-default maintenance branch remained when this report was prepared.

Historical failed runs are immutable GitHub records. They are superseded by the successful default-branch run linked above.
