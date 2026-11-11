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

The native application is one trusted OS owner's **local plaintext** workspace, not an anonymous
upload site or multiuser account service. It reserves a fresh loopback port and uses an instance
capability plus exact browser Origin for mutations. A separate HttpOnly cookie permits only
sandboxed static previews. User PDFs, technical content and saved projects are not transmitted.
The sole setup fetch is an explicitly approved pinned official PDF-engine wheel; see
[licensing/setup](docs/PDF_ENGINE_SETUP.md). Path admission protects against ordinary link,
hardlink and installation-directory mistakes before mutation, while a hostile process already
running as the same OS user remains outside this boundary. Close normally before backing up a
workspace and review confidential source contents before exporting a portable project.
