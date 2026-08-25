# Security Policy

## Supported versions

primus is in **beta** (`0.0.x`). Only the latest published `@selisedev/primus-beta`
release receives security fixes.

| Version        | Supported          |
| -------------- | ------------------ |
| latest `0.0.x` | :white_check_mark: |
| older `0.0.x`  | :x:                |

Because primus is distributed as a **source registry** (the CLI copies component
source into your app), security fixes reach you when you re-run `primus add` /
`primus diff` and re-copy the affected component — not automatically via a runtime
dependency bump. Review `primus diff <component>` after upgrading.

## Reporting a vulnerability

**Do not open a public issue for security vulnerabilities.**

Report privately through either:

1. **GitHub Security Advisories** — open a draft advisory at
   <https://github.com/kinleyrabgay/primus/security/advisories/new> (preferred), or
2. **Email** — rabgayofficial@gmail.com with subject `SECURITY: primus`.

Please include:

- affected component / module and version,
- a description of the issue and its impact,
- a minimal reproduction or proof of concept,
- any suggested remediation.

## What to expect

- **Acknowledgment** within 5 business days.
- An initial **assessment** and severity classification shortly after.
- Coordinated disclosure: we'll agree on a fix and disclosure timeline with you, and
  credit you in the advisory unless you prefer to remain anonymous.

## Scope

In scope: the component source, the CLI (`cli/`), the vendored PrimeUIX engine
(`src/primeuix/`), and the build/publish scripts (`scripts/`).

Out of scope: vulnerabilities in upstream dependencies (report those to the
respective projects), and issues that require a misconfigured consuming app.
