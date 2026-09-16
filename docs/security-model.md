# Security and threat model

## Assets

- Reviewed source bytes and checksums
- Warning and procedural meaning
- Published HTML integrity
- Provenance and quality evidence
- CI credentials and repository contents

## Trust boundaries

Registry and PDF content are untrusted input. The registry parent is the source filesystem boundary.
Generated files cross into a reviewer-controlled output directory. CI runs third-party actions but
receives read-only repository permissions.

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
| Excessive CI authority | Workflow default is `contents: read`; no write token or deployment secret. |

## Residual risk

PDF parsing libraries have a large attack surface. Process isolation, OS-level quotas, malware
scanning, and allowlisted source intake are recommended for untrusted public uploads. This sample
does not claim sandbox isolation.

Automated rules cannot confirm technical truth, safety adequacy, legal rights, or the accuracy of
image descriptions. A qualified human must approve those properties.

## Reporting a vulnerability

Follow [SECURITY.md](../SECURITY.md). Do not include sensitive source documents or exploit payloads
in a public issue.
