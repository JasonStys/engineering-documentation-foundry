# Data contracts and invariants

## Registry

- Version is exactly `1`.
- One to 500 sources are allowed.
- IDs are lowercase and contain only letters, digits, dots, underscores, and hyphens.
- Source IDs are unique.
- Paths are relative, traversal-free, contained after symlink resolution, and end in `.pdf`.
- Unknown keys are errors.

The exported contract is `schemas/source-registry.schema.json`.

## Extracted document

A document retains its complete source record, calculated digest, positive page count, and ordered
blocks. Every block has a stable ID, kind, one-based page, PDF bounding box, confidence, and content
appropriate to its kind.

## Canonical topic

A topic has a stable ID, human title, content type, source ID, source revision, and ordered blocks.
Each topic block repeats its source block ID and coordinates. Tables preserve a rectangular row
matrix when the extractor can observe one.

## Safety notice

The warning contract deliberately has no fallback text:

- severity: notice, caution, warning, or danger;
- condition: circumstance that creates the hazard;
- consequence: credible result of exposure;
- avoidance: action that prevents or reduces harm.

An incomplete source notice stays visible as text and creates `warning.incomplete` with error
severity.

## Migration report

The report contains the deterministic build ID and source digest, publication decision, aggregate
counts, per-document coverage, and sorted findings. A build is publishable exactly when it has no
error-severity issues. The exported contract is `schemas/migration-report.schema.json`.

## Provenance trace

Each JSON Lines record maps a canonical topic/block pair to source ID, revision, extraction block,
page, and bounding box. JSON Lines permits streaming inspection without loading the entire corpus.
