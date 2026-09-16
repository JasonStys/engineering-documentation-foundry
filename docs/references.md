# Primary references

The implementation uses primary specifications and official project documentation.

- [PyMuPDF text and table extraction](https://pymupdf.readthedocs.io/en/latest/the-basics.html)
- [Pydantic model configuration and validation](https://docs.pydantic.dev/latest/concepts/models/)
- [Jinja autoescaping API](https://jinja.palletsprojects.com/en/stable/api/#autoescaping)
- [Python `pathlib`](https://docs.python.org/3/library/pathlib.html)
- [Python packaging with `pyproject.toml`](https://packaging.python.org/en/latest/guides/writing-pyproject-toml/)
- [PEP 8 style guide](https://peps.python.org/pep-0008/)
- [PEP 257 docstring conventions](https://peps.python.org/pep-0257/)
- [pytest good integration practices](https://docs.pytest.org/en/stable/explanation/goodpractices.html)
- [GitHub secure-use reference](https://docs.github.com/en/code-security/tutorials/secure-your-organization/protect-against-threats)
- [W3C WAI table concepts](https://www.w3.org/WAI/tutorials/tables/)
- [W3C WAI headings](https://www.w3.org/WAI/tutorials/page-structure/headings/)
- [NIST Secure Software Development Framework 1.1](https://csrc.nist.gov/pubs/sp/800/218/final)

Version bounds in `pyproject.toml` define tested compatibility. Dependency updates are reviewed by
CI instead of being accepted implicitly at runtime.
