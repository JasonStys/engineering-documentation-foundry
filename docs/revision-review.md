# Review a corpus before publication approval

The publication pipeline verifies extraction and observable quality. A release reviewer also needs
to know what changed. `docfoundry compare` reads the baseline and candidate `canonical/topics.json`
files and produces a separate deterministic dossier. It does not mutate either build, waive a
quality finding, approve instructions or publish blocked HTML.

```bash
docfoundry compare build/baseline/canonical/topics.json build/candidate/canonical/topics.json \
  --output build/revision-review --fail-on-change
```

The new output directory contains `comparison.html` and `comparison.json`. The parent must exist;
any existing destination is refused. All input/schema validation and rendering happen before the
directory is created. An I/O failure while writing can leave a partial review directory for manual
inspection; it never replaces a publication or source. Select a fresh output path when retrying.

The HTML report shows change counts, stable source/topic identities, semantic fields, human-readable
before/after content and explicit source revision, page, block ID and bounding-box citations.
Tables have real column headers; safety notices retain condition, consequence and avoidance. Full
canonical records remain available in expandable details. Content is autoescaped and JSON escapes
HTML-sensitive characters. A restrictive CSP prohibits scripts/network resources; the report works
as a local file without a service, sign-in or analytics. Created by Jason Stys.

## Interpretation

| State or flag | Meaning |
|---|---|
| Added / removed | A stable `(source_id, topic_id)` exists on only one side. A rename is not silently inferred. |
| Changed: content | Title, content type or canonical block content differs. |
| Changed: source_revision | A declared revision label differs; this alone is not a semantic edit. |
| Changed: provenance | Source block IDs or page/coordinates differ, including reordered extraction blocks. |
| Safety review required | Complete cited warning records differ, including notice removal or relocation. It is a human review flag, not proof of a defect. |
| Unchanged | Exact validated canonical records match regardless of corpus list order or JSON whitespace. |

Identical titles from different sources remain distinct. An empty corpus is valid and can expose
complete removals after a blocked extraction. Missing topics and notices remain visible rather than
being treated as an absence of changes. Before/after SHA-256 values fingerprint validated, sorted
canonical records; these are not hashes of PDF bytes or proof of registry authenticity.

Use `--fail-on-change` for a review gate: `0` means no differences, `2` means review is required,
`1` means validation/operational failure. Without the flag, successful comparisons return `0` even
when differences exist. A changed source label alone still requires review under the gate.

## Bounds and limits

Each input is read with a hard 16 MiB byte limit and at most 10,000 topics. Invalid UTF-8/JSON,
duplicate JSON keys, duplicate source/topic identities and unknown canonical fields are rejected.
The strict existing Topic schema remains authoritative. Matching costs O(n log n + b) time and
O(b) report space for n topics and b retained block content. No AI, heuristic rename pairing or
semantic equivalence is claimed. Coordinate-only changes can be noisy; the distinct provenance
flag lets reviewers recognize that case without suppressing it.

The comparison is an offline review layer alongside existing build/atomic-publication contracts.
It has no accounts or live editing service. Keep private corpora/review files in an appropriate
private filesystem location. Tests and demos use only the repository's original synthetic manuals.
