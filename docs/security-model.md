# Security and threat model

## Assets

- Reviewed source bytes and checksums
- Warning and procedural meaning
- Published HTML integrity
- Provenance and quality evidence
- CI credentials and repository contents

## Trust boundaries

Registry and PDF content are untrusted input. The registry parent is the source filesystem boundary.
Generated files cross into a reviewer-controlled output directory. Normal validation receives
read-only repository permissions; only the isolated CodeQL analysis jobs may upload security events.

## Threats and controls

| Threat | Control |
|---|---|
| Path traversal or symlink escape | Validate relative syntax, resolve paths, and require containment. |
| Source substitution | Stream SHA-256 and enforce a declared digest when provided. |
| Resource exhaustion | Bound bytes, pages, and blocks; stream hashing and manifest creation. |
| Embedded PDF behavior | Extract data only; never execute actions, attachments, or scripts. |
| HTML injection | Jinja autoescaping, strict undefined variables, and no source-provided template code. |
| Silent safety loss | Required warning fields and error-severity publication gate. |
| Partial output | Sibling staging directory followed by atomic rename. |
| Accidental overwrite | Fail closed unless `--overwrite`; reject broad destinations. |
| CI dependency drift | Full commit SHA pins for actions and dependency audit on every CI run. |
| Excessive CI authority | Workflow default is `contents: read`; only CodeQL jobs have `security-events: write` for SARIF, with no build/install steps or deployment secret. |

## Code scanning

`.github/workflows/codeql.yml` runs separate `python` and `actions` jobs with no-build extraction,
`security-extended` queries and a 20-minute deadline. Main pushes, main-targeting pull requests,
weekly schedules and manual requests trigger analysis. There are no source exclusions, ignored
queries, suppressed findings or privileged `pull_request_target` events. Actions are pinned to full
commits and checkout does not retain credentials. Only analysis jobs receive `security-events:
write`; the default token remains read-only, and those jobs never install or execute this project.
Dependency/extractor caches and database uploads are disabled. Processed SARIF results are stored
in GitHub's Code scanning service without an additional Actions artifact upload.

Review both languages, exact source revision, extraction warnings and open alerts after the
workflow finishes. A green execution means extraction, queries and upload processing succeeded;
it does not guarantee zero alerts or prove vulnerability absence. Trace reported paths to determine
whether an issue is real, add a meaningful regression for confirmed defects, and rerun CodeQL and
the normal tests. PDF binary behavior, third-party native parser internals, Jinja template coverage,
technical correctness, operating-system isolation and human approval are not established by this
Python/Actions scan. Existing defensive parsing, escaping, resource-bound, publication and audit
checks remain required. See [the setup and validation record](reports/codeql-2026-11-09.md).

## Residual risk

PDF parsing libraries have a large attack surface. Process isolation, OS-level quotas, malware
scanning, and allowlisted source intake are recommended for untrusted public uploads. This sample
does not claim sandbox isolation.

Automated rules cannot confirm technical truth, safety adequacy, legal rights, or the accuracy of
image descriptions. A qualified human must approve those properties.

## Reporting a vulnerability

Follow [SECURITY.md](../SECURITY.md). Do not include sensitive source documents or exploit payloads
in a public issue.
