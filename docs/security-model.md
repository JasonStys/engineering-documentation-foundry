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

`.github/workflows/codeql.yml` runs separate `python`, `javascript-typescript` and `actions` jobs with no-build extraction,
`security-extended` queries and a 20-minute deadline. Main pushes, main-targeting pull requests,
weekly schedules and manual requests trigger analysis. There are no source exclusions, ignored
queries, suppressed findings or privileged `pull_request_target` events. Actions are pinned to full
commits and checkout does not retain credentials. Only analysis jobs receive `security-events:
write`; the default token remains read-only, and those jobs never install or execute this project.
Dependency/extractor caches and database uploads are disabled. Processed SARIF results are stored
in GitHub's Code scanning service without an additional Actions artifact upload.

Review all three languages, exact source revision, extraction warnings and open alerts after the
workflow finishes. A green execution means extraction, queries and upload processing succeeded;
it does not guarantee zero alerts or prove vulnerability absence. Trace reported paths to determine
whether an issue is real, add a meaningful regression for confirmed defects, and rerun CodeQL and
the normal tests. PDF binary behavior, third-party native parser internals, Jinja template coverage,
technical correctness, operating-system isolation and human approval are not established by this
Python/editor/Actions scan. Existing defensive parsing, escaping, resource-bound, publication and audit
checks remain required. See [the setup and validation record](reports/codeql-2026-11-09.md).

## Native owner and document boundaries

The 0.2.0 application admits one explicit empty or matching workspace directory. Existing ancestor
aliases, reparse points, hardlinked marker/lock/database/recovery files and actual frozen program
trees are refused before mutation. It holds a nonblocking OS-owner lock until the listener,
accepted handlers and actual PDF children have finished. These admission checks do not claim to
defend against concurrent hostile namespace changes by the same OS account.

The listener prebinds `127.0.0.1:0`; it never adopts an old server. Private API reads need a random
instance capability. Mutations additionally require the exact Origin, one bounded JSON length,
no transfer encoding and no ambiguous authority headers, all before reading the body. At most
four handlers are admitted. Preview cookies cannot authorize APIs; previews accept only original
saved HTML/CSS with a no-script sandbox and no external-resource permission. App rendering uses
text nodes, not source-supplied markup. Closing a browser does not close the native owner.

PDF jobs use fixed argv and a minimal child environment, a fresh hash-named input directory,
60-second execution budget, bounded concurrent protocol/diagnostic collection and independent
manifest/decision checks. An operational failure does not create a saved build. A mechanically
blocked publication preserves original reports/canonical data without a site. This child boundary
is useful failure isolation, **not** an OS sandbox or guarantee against native parser exploits.

Dependency setup happens before profile/listener creation. The app itself contains no parser
binary; a separate verified exact official wheel is imported only after explicit consent and a
complete offline byte/tree check. The provider receives a normal dependency request but no
document/account content. See [the actual licensing and download boundary](PDF_ENGINE_SETUP.md).

## Residual risk

PDF parsing libraries have a large attack surface. Process isolation, OS-level quotas, malware
scanning, and allowlisted source intake are recommended for untrusted public uploads. This sample
does not claim sandbox isolation.

Automated rules cannot confirm technical truth, safety adequacy, legal rights, or the accuracy of
image descriptions. A qualified human must approve those properties.

## Reporting a vulnerability

Follow [SECURITY.md](../SECURITY.md). Do not include sensitive source documents or exploit payloads
in a public issue.
