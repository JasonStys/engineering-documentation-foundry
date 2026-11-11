# Explicit local PDF engine setup

The authored Engineering Documentation Foundry source is MIT licensed. The
native download does **not** bundle PyMuPDF, fitz or MuPDF parser binaries.
PyMuPDF/MuPDF have GNU AGPL v3 open-source terms or an Artifex commercial
license. This distribution design does not certify licensing compliance or
provide a commercial license. Review [upstream licensing](https://pymupdf.io/licensing)
and the exact provider's retained notices before choosing Install.

The first-run native dialog displays the exact official PyPI wheel filename,
provider URL, byte count, SHA-256 and ABI. Install and Cancel are available before
opening a workspace, PDF or application listener. Only explicit Install, or
typing exactly `INSTALL` in `--setup-engine` console mode, authorizes download.
Cancel does not open user data. Closing during an approved download waits for
that bounded writer, then exits without opening documents.

Setup contacts only the pinned `https://files.pythonhosted.org/` object. The
provider receives a normal HTTPS dependency request and connection metadata;
no PDF, project, password or workspace content is sent. Redirects and proxy
inheritance are refused. There is no pip invocation, source build, downloaded
installer script, global environment change or automatic dependency upgrade.

The application verifies the entire pinned wheel, package/version/ABI metadata,
each RECORD hash/size, conventional member paths and actual expanded-byte
budgets before installing into a separate per-user dependency directory. A new
atomic absent pointer activates it. Existing unknown or corrupt evidence is
preserved and refused. Every later launch checks the complete exact tree and
all bytes offline before import. Source workspaces remain separate from software
and dependency files. This is a trusted OS-owner boundary, not a sandbox for
hostile same-account filesystem writers or native PDF-parser vulnerabilities.

The source CLI retains its existing dependency contract. The development lock
contains PyMuPDF for genuine PDF tests; the bundled-runtime lock omits it.
Packaging additionally inspects the actual frozen module inventory and output
tree, refusing embedded parser modules, metadata or recognizable libraries.

The supported native families are standard CPython 3.14, Windows AMD64,
glibc 2.28+ Linux x86-64 and macOS 11+ Apple Silicon. Unsupported CPU, OS or
free-threaded ABI fails without downloading a fallback. Native builds require
final Python 3.14.10 or a later 3.14 security patch. Original source CLI support
on Python 3.11–3.13 remains separately tested.

On Windows the app retains and verifies both the patched SDK's main Python DLL
and its stable-ABI `python3.dll` stub. The official PyMuPDF wheel additionally
depends on Microsoft's Visual C++ runtime. If that system prerequisite is absent,
use Microsoft's supported redistributable rather than downloading loose DLLs.
See the [upstream installation troubleshooting](https://pymupdf.readthedocs.io/en/latest/installation.html#problems-after-installation)
and [Microsoft's supported runtime downloads](https://learn.microsoft.com/en-us/cpp/windows/latest-supported-vc-redist).
The app does not install global runtimes or claim a clean-machine installer transaction.
