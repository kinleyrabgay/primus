# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

> **Versioning note.** `@selisedev/primus-beta` is the pre-release (beta) channel and
> moves on the `0.0.x` line. The stable package will be published as
> `@selisedev/primus`. The base version string (`21.1.9`) tracks the PrimeNG release
> the library was forked from.

## [Unreleased]

## [0.0.4] — 2026-08-25

### Changed

- Repository-wide formatting unified to 4-space indentation (Prettier + EditorConfig);
  `format`/`format:check` scripts now cover `cli/`, `scripts/`, `tools/`, and root
  files in addition to `src/`.

### Fixed

- `cli/build-registry.mjs`: escaped a `/` in the component-import regex that
  terminated the pattern early; regenerated `cli/registry.json` (now resolves
  cross-component deps correctly).
- Test suite: unblocked a compile error (`*ngFor` → `@for` in a dynamic-dialog spec)
  and fixed the 3 failures it masked (card dynamic-PT spec pattern, focustrap jsdom
  `getComputedStyle` crash). Suite is green (7201 passed).
- Editor tooling: `tsconfig.json` now references `tsconfig.spec.json` (with
  `composite: true`) so spec files resolve Vitest globals (`beforeEach`, etc.) in the
  IDE.

### Added

- Community docs: `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`, `SECURITY.md`, `CHANGELOG.md`.
- `.github/` issue + PR templates and a CI workflow (format, registry check, build,
  test on Node 22).
- `.prettierignore` for build output, `node_modules`, generated `cli/registry.json`,
  and the lockfile.

## [0.0.3] — 2026-08-24

### Changed

- **CLI: config-only `init`.** `primus init` now writes `primus.json` only (plus
  tsconfig path aliases) and copies nothing. `core/` and `theme/` initialize **lazily**
  on the first `primus add`, so a fresh init leaves no gap folders.
- Dropped `primus.config.ts` in favor of `primus.json`.
- README rewritten to the current shadcn-style npm flow (config-only init, lazy add,
  source-registry publishing).

## [0.0.2] — 2026-08-24

### Changed

- **Published package is now a shadcn-style source registry + CLI**, not an importable
  library. `@selisedev/primus-beta/components|core|theme/*` are intentionally **not**
  importable from the package; the CLI copies their source into the consuming app.
  The vendored `primeuix` engine remains importable because copied components need it
  at runtime.

## [0.0.1] — 2026-08-21

### Added

- Initial beta release of `@selisedev/primus-beta`.
- Fork of **PrimeNG 21.1.9** (MIT), retargeted to **Angular 22 / TypeScript 6**.
- **PrimeUIX theming engine vendored in-tree** (`utils`, `styled`, `styles`, `motion`,
  `themes`) as `@selisedev/primus-beta/primeuix/*` — no external `@primeuix/*`
  dependency. Bundled theme presets (Aura/Lara/Material/Nora) stripped; only the
  `definePreset` engine and design-token types are kept.
- 100 components, 17 core modules, and a single design-token theme system
  (`primitives / semantic / components / preset`).
- Zero third-party runtime dependencies beyond Angular + `tslib`.

[Unreleased]: https://github.com/kinleyrabgay/primus/compare/v0.0.4...HEAD
[0.0.4]: https://github.com/kinleyrabgay/primus/compare/v0.0.3...v0.0.4
[0.0.3]: https://github.com/kinleyrabgay/primus/compare/v0.0.2...v0.0.3
[0.0.2]: https://github.com/kinleyrabgay/primus/compare/v0.0.1...v0.0.2
[0.0.1]: https://github.com/kinleyrabgay/primus/releases/tag/v0.0.1
