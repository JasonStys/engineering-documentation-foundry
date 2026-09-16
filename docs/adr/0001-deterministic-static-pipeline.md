# ADR 0001: Use a deterministic static pipeline

- Status: Accepted
- Date: 2026-09-16

## Context

Technical-document migrations need traceability, repeatability, reviewable failure output, and a
deployment artifact with a small attack surface. A dynamic service or model-dependent pipeline
would add state and variability before the underlying content contracts are established.

## Decision

Use an offline Python CLI with strict Pydantic contracts, PyMuPDF extraction, deterministic
normalization, explicit validators, autoescaped Jinja templates, and static HTML output. Retain
canonical JSON and block-level provenance beside the published site. Do not publish HTML when any
error-severity finding exists.

## Consequences

Benefits include reproducible review, inexpensive hosting, straightforward CI, and limited runtime
exposure. Tradeoffs include heuristic segmentation, no collaborative editing UI, and no OCR in the
first release. Those capabilities can be added behind existing stage contracts.
