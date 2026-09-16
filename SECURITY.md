# Security policy

## Supported versions

Security fixes are applied to the latest release on the default branch.

## Report a vulnerability

Please use GitHub's private security advisory workflow for this repository. Do not disclose the
issue publicly until a fix and coordinated release are available. Include affected version, impact,
minimal reproduction, and proposed mitigation when known. Do not attach confidential documents,
credentials, or unnecessary exploit payloads.

## Scope note

This sample validates and extracts PDFs but is not an operating-system sandbox. Deployments that
accept public uploads should add process isolation, quotas, malware scanning, and an allowlisted
intake workflow as described in `docs/security-model.md`.
