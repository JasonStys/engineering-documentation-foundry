# Engineering Documentation Foundry handbook

By Jason Stys.

Compare canonical corpus revisions by stable identity, highlighting source-cited content and safety-warning changes in HTML/JSON.

The published 0.2.0 Windows portable release supplies a genuine local native/browser authoring application:
upload actual PDFs, edit/save projects, run the same publication engine, inspect/download exact
outputs and retain review history. Start with [the native application guide](native-application.md).
Its [explicit dependency setup](PDF_ENGINE_SETUP.md) and [new validation](reports/native-application-2026-11-11.md)
are separate from the historically reviewed Office editions below.

Gives publication reviewers a precise change review before shipping revised documentation.

The [current illustrated application guide](reports/windows-application-guide-0.2.0.docx),
[public review manifest](reports/windows-application-guide-0.2.0.json) and
[installed validation](reports/installed-windows-0.2.0-2026-11-11.md) cover the independently
downloaded Windows application. The older editions below keep their own source and observations.

## Read the documentation

| Edition | Audience and contents |
| --- | --- |
| [project-guide.docx](reports/project-guide.docx) | User and developer guide: purpose, current usage, design, boundaries and source references. |
| [validation-review.docx](reports/validation-review.docx) | Reviewer edition: exact tested baseline, observed workflows, dated local results and remaining limits. |
| [validation-evidence.xlsx](reports/validation-evidence.xlsx) | Two filterable Excel Tables for observed workflows and test-source inventory, with recalculating outcome formulas. |

The editable Markdown remains the maintenance source. The Word files are readable editions. The workbook is an evidence index rather than a test runner. See [publication identities and review](reports/publications.json) and the [documentation refresh record](reports/documentation-refresh-2026-11-09.md).

## Current usage and help

[README quick start](../README.md) is the entry point. Use the project-specific guides below before changing inputs, operating modes or deployment assumptions.

### Usage and operations

- [revision review](revision-review.md)
- [user guide](user-guide.md)

### Design and contracts

- [adr/0001 deterministic static pipeline](adr/0001-deterministic-static-pipeline.md)
- [architecture](architecture.md)
- [data contracts](data-contracts.md)
- [security model](security-model.md)

### Security and validation

- [testing and validation](testing-and-validation.md)

## Historical results and reproduction

The reviewed source is [`dd47b617bca4ffa678b076b4963029b67faa50a5`](https://github.com/JasonStys/engineering-documentation-foundry/tree/dd47b617bca4ffa678b076b4963029b67faa50a5). The observed functional workflow baseline is `dd47b617bca4ffa678b076b4963029b67faa50a5`; those observations are recorded at `2026-11-10T06:15:17.239369+00:00`. They do not certify an unrun later revision.

- [Detailed recorded validation](reports/practical-workflows-2026-11-09.md)
- [Current Actions](https://github.com/JasonStys/engineering-documentation-foundry/actions) records later integration checks separately.
- Preserve dated measurements and follow the existing testing guide to reproduce them; a test-source inventory alone does not establish execution.

## Practical boundaries

- Comparison matches stable identities without inferring semantic renames or equivalent safety meaning.
- Operational write failures can leave a partial review directory; source documents and published output are not changed by comparison.
- Source citations and warning diffs support human review, not a certification that a revised procedure is safe.

## Maintaining these editions

Update the editable usage/design/test documents first. Rebuild and visually review every Word page and workbook tab before replacing an edition; verify the exact binary digests and evidence source in publications.json. Keep account data, logs with secrets, installed-app state and private test stores out of documentation. Source and release assets retain their existing security and licensing boundaries.
