# Documentation refresh — 2026-11-09

By Jason Stys.

This documentation-only edition describes source `dd47b617bca4ffa678b076b4963029b67faa50a5`. It does not change application behavior, accounts, private data, installers or published releases.

## Published editions and completed review

| File | Bytes | SHA-256 | Reviewed scope |
| --- | ---: | --- | --- |
| [project-guide.docx](project-guide.docx) | 43598 | `3973681d562ee8c793c93e2775009d530f41b4f83fcb54256eecc064106fffb7` | 5 pages, each viewed individually |
| [validation-review.docx](validation-review.docx) | 41882 | `16b553791e93dc3529a7f22e31db307d2768ee3748470f8721cfda59995bffdd` | 3 pages, each viewed individually |
| [validation-evidence.xlsx](validation-evidence.xlsx) | 7365 | `fa6b016b4d6c9ffeae972dba49c7ab0cc31b35eba260979238b21eec23dee034` | Both tab previews; two actual Excel Tables/autoFilters; four formulas; failure-change/restore recalculation and zero formula errors |

Word review checked plain black titles, readable pagination, whole table rows, source references, practical limits and absence of clipping or overflow. Render receipts were matched to the current DOCX digest before approval. Workbook review inspected both tab previews and actual exported Table/autoFilter elements; recalculated success/failure summaries were compared independently with workflow metadata. Static previews do not draw Excel dropdown arrows; the exported workbook contains the actual filters.

## Evidence and change boundary

- Functional baseline: `dd47b617bca4ffa678b076b4963029b67faa50a5`.
- Workflow observation: `2026-11-10T06:15:17.239369+00:00`; exact run URLs and source identities remain in [publications.json](publications.json).
- Local document-package validation verifies exact copied bytes, Office ZIP integrity, approved page/tab identities and internal documentation links. Repository-specific documentation and source-policy commands are run separately and recorded in the integration handoff.
- Source/index metadata is regenerated using the repository’s existing tools. Existing privacy, security, coverage and workflow gates are retained.
- PR and later main workflows must pass independently. This record does not claim future or unrun integration CI success.

## Interpretation

The Word files document the cited source; dated source reports retain their original execution scope. A passing workflow is distinct from completed analysis with zero findings, and neither establishes production suitability. The Excel source inventory is not a per-test execution report. Checksums identify exact bytes, not a signature or publisher attestation.

Use the [handbook](../handbook.md) to choose usage, design, security and test documentation. Keep editable Markdown and reviewed editions together; do not replace historical measurements with undated claims.
