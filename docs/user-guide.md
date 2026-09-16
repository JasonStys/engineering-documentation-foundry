# User guide

## Prepare a registry

Registries may be YAML or JSON. Paths are relative to the registry, which makes a corpus portable
and defines its filesystem trust boundary.

```yaml
registry_version: 1
sources:
  - source_id: controller-guide
    revision: "2.1"
    product_model: Example Controller
    owner: Documentation Engineering
    license: Internal approved source
    path: sources/controller-guide.pdf
    sha256: 12b4...64-lowercase-hex-characters...
    migration_status: approved
```

`sha256` is optional for exploration and recommended for reviewed migration runs. The CLI always
calculates the actual digest and includes it in the report.

## Build

```bash
docfoundry build path/to/source-registry.yaml --output build/review
```

The output path must be dedicated. If it exists, inspect it and then opt into replacement. For
safety, replacement succeeds only for a prior output with a valid version 1 Foundry manifest:

```bash
docfoundry build path/to/source-registry.yaml --output build/review --overwrite
```

## Interpret findings

- `error`: publication is blocked. Canonical data and reports remain available for diagnosis.
- `warning`: publication is allowed, but human review is required.
- `info`: non-blocking observation for reviewers.

Each finding includes a stable code and source. Page and block IDs appear when the problem can be
localized.

## Review checklist

1. Confirm source counts, revisions, checksums, and ownership in the JSON report.
2. Resolve every error; do not edit generated HTML to conceal a finding.
3. Review warning semantics, procedures, units, tables, and image alternatives against the PDF.
4. Spot-check `canonical/trace.jsonl` links from output blocks back to pages and rectangles.
5. Run keyboard and screen-reader checks on the site before release.
6. Retain the manifest with the approved build.

## Recreate the synthetic corpus

The committed PDFs are reproducible from original text in `tools/generate_fixtures.py`:

```bash
python tools/generate_fixtures.py
```

PDF container metadata can differ between library versions, so regenerate fixtures only as an
intentional source revision and update registry checksums if they are added.
