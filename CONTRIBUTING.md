# Contributing to primus

Thanks for your interest in improving **primus**. This document explains how the
repository is laid out, how to get a working build, and the conventions a change
must follow before it can be merged.

> **This repo is the authoring/build harness**, not a consumer app. It compiles the
> library and runs the tests; downstream apps consume the published package via the
> `primus` CLI (`primus add <component>`). Keep that distinction in mind — most
> changes here are to component _source_, the theme system, or the CLI, never to a
> running application.

---

## Table of contents

1. [Code of conduct](#code-of-conduct)
2. [Ways to contribute](#ways-to-contribute)
3. [Prerequisites](#prerequisites)
4. [Getting started](#getting-started)
5. [Project layout](#project-layout)
6. [Development workflow](#development-workflow)
7. [Coding standards](#coding-standards)
8. [Commit conventions](#commit-conventions)
9. [Adding or changing a component](#adding-or-changing-a-component)
10. [Working on the vendored PrimeUIX engine](#working-on-the-vendored-primeuix-engine)
11. [Pull request checklist](#pull-request-checklist)
12. [Reporting bugs & requesting features](#reporting-bugs--requesting-features)
13. [License of contributions](#license-of-contributions)

---

## Code of conduct

This project is governed by the [Code of Conduct](./CODE_OF_CONDUCT.md). By
participating you agree to uphold it. Report unacceptable behavior to the
maintainers (see [SECURITY.md](./SECURITY.md) for the private contact).

## Ways to contribute

- **Fix a bug** in a component, the CLI, or the theming engine.
- **Improve docs** — README, `INTEGRATION.md`, in-code JSDoc, or this file.
- **Retarget upstream fixes** — port a relevant MIT-era PrimeNG/PrimeUIX fix into the
  fork (cite the upstream commit in your PR).
- **Improve tests** — the suite runs on Vitest + jsdom; more coverage is always welcome.

Please **open an issue before large changes** so we can agree on scope before you
invest time.

## Prerequisites

| Tool       | Version                              |
| ---------- | ------------------------------------ |
| Node.js    | ≥ 20 (Angular 22 requirement)        |
| pnpm       | 9.6.0 (see `packageManager` in root) |
| Angular    | 22.x (via catalog)                   |
| TypeScript | 6.0.3 (via catalog)                  |

This repo uses **pnpm workspaces + catalogs**. Do not use `npm install` or `yarn` —
the lockfile and catalog resolution are pnpm-specific.

## Getting started

```bash
git clone git@github.com:kinleyrabgay/primus.git
cd primus
pnpm install

pnpm build     # ng-packagr -> dist/ (361 secondary entry points)
pnpm test      # vitest (jsdom)
pnpm lint      # ng lint
```

If any of these fail on a clean checkout, that's a bug — please open an issue.

## Project layout

```
src/
  components/   100 UI components   -> @selisedev/primus-beta/components/*
  core/         infra + provider    -> @selisedev/primus-beta/core/*
  theme/        design system       -> @selisedev/primus-beta/theme
  primeuix/     vendored engine     -> @selisedev/primus-beta/primeuix/*
cli/            primus CLI + generated component registry
tools/          optional static-CSS theme generator
scripts/        build harness (prebuild / postbuild / pack-prep)
```

See the [README](./README.md#repository-layout) and
[Entry-point architecture](./README.md#entry-point-architecture) for the full picture.
Every folder under `src/` is a secondary entry point of the single package
`@selisedev/primus-beta`.

## Development workflow

1. Branch off `main`: `git checkout -b fix/button-focus-ring`.
2. Make the change. Keep it focused — one logical change per PR.
3. Format, lint, and test locally:
    ```bash
    pnpm format
    pnpm lint
    pnpm test
    ```
4. If you touched cross-component or npm dependencies, **regenerate the registry**:
    ```bash
    node cli/build-registry.mjs
    ```
    CI runs `node cli/build-registry.mjs --check` and fails if `cli/registry.json` is
    stale.
5. Open a PR against `main` and fill in the checklist below.

## Coding standards

- **Formatting is enforced by Prettier** — config in `.prettierrc.json`
  (4-space indent, single quotes, no trailing commas, `printWidth` 250). Run
  `pnpm format` before committing; `pnpm format:check` must pass. A `lint-staged`
  hook formats staged files.
- **Lint** with `pnpm lint` (Angular ESLint). Fix warnings you introduce.
- **TypeScript** targets the repo's `tsconfig.json` settings — do not loosen
  compiler options to make an error go away.
- **Brand-neutral CSS.** Component styles must reference design tokens
  (`dt('button.primary.color')`), never hardcoded colors. Token _values_ live in
  `src/theme/`.
- **No new runtime dependencies** without discussion. The shipped `dist` runtime
  deps must stay at `tslib` only; anything else has to be a peer.

## Commit conventions

Commit messages follow **[Conventional Commits](https://www.conventionalcommits.org/)**:

```
<type>(<optional scope>): <subject>
```

Common types: `feat`, `fix`, `docs`, `refactor`, `test`, `chore`, `build`, `perf`.

```
feat(button): add loading state with spinner slot
fix(table): correct sort icon when sortField is nested
docs(readme): clarify lazy core/theme init on first add
chore: bump to 0.0.4
```

Keep the subject ≤ 72 chars, imperative mood. Add a body only when the _why_ isn't
obvious from the subject.

## Adding or changing a component

Each component lives in `src/components/<name>/` and is a standalone entry point:

```
components/<name>/
  <name>.ts            component / directive
  <name>.spec.ts       Vitest unit test
  style/<name>style.ts brand-neutral CSS (dt('...') tokens)
  public_api.ts        entry-point barrel
  ng-package.json      marks the secondary entry point
```

When adding/changing a component:

- Keep styles token-driven; add new tokens under `src/theme/` if needed.
- Add or update the `*.spec.ts` — new behavior needs a test.
- If the component imports another component or an npm package, regenerate the
  registry (`node cli/build-registry.mjs`) so the CLI resolves transitive deps.
- Update the [component catalog](./README.md#component-catalog) in the README if you
  add a new component.

## Working on the vendored PrimeUIX engine

`src/primeuix/` is an **in-tree MIT fork** of the (now archived, commercial) PrimeUIX
packages — `utils`, `styled`, `styles`, `motion`, `themes`. When editing it:

- Preserve each vendored directory's upstream `LICENSE` file.
- Record provenance changes in [`NOTICE.md`](./NOTICE.md).
- Respect the entry-point rules in the
  [README](./README.md#entry-point-architecture) (subpath imports need an
  `ng-package.json`; `utils` is a single entry point; `styles` is per-component).

## Pull request checklist

Before requesting review, confirm:

- [ ] `pnpm format:check` passes
- [ ] `pnpm lint` passes
- [ ] `pnpm test` passes
- [ ] `pnpm build` succeeds (if you touched source, entry points, or build scripts)
- [ ] `node cli/build-registry.mjs --check` passes (if deps changed)
- [ ] Tests added/updated for behavior changes
- [ ] Docs updated (README catalog, JSDoc, `INTEGRATION.md`) where relevant
- [ ] Commits follow Conventional Commits
- [ ] `CHANGELOG.md` updated under **Unreleased** for user-facing changes

## Reporting bugs & requesting features

- **Security vulnerabilities:** do **not** open a public issue — follow
  [SECURITY.md](./SECURITY.md).
- **Bugs:** open an issue with a minimal reproduction (component, version, expected
  vs actual, and a snippet or StackBlitz if possible).
- **Features:** open an issue describing the use case before sending a PR.

Issue tracker: <https://github.com/kinleyrabgay/primus/issues>

## License of contributions

primus is **MIT licensed**. By submitting a contribution you agree that your work is
licensed under the same [MIT License](./LICENSE.md), and that you have the right to
submit it. Do **not** copy code from PrimeNG v22 or any release under the commercial
PrimeUI license into this fork — only MIT-era upstream code may be ported.
