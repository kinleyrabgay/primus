# @selisedev/primus-beta

<p>
  <a href="https://www.npmjs.com/package/@selisedev/primus-beta"><img alt="npm version" src="https://img.shields.io/npm/v/@selisedev/primus-beta?color=cb3837&label=npm"></a>
  <a href="./LICENSE.md"><img alt="license" src="https://img.shields.io/badge/license-MIT-blue.svg"></a>
  <img alt="Angular" src="https://img.shields.io/badge/Angular-22-dd0031?logo=angular&logoColor=white">
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-6.0-3178c6?logo=typescript&logoColor=white">
  <img alt="components" src="https://img.shields.io/badge/components-100-6d28d9">
  <img alt="status" src="https://img.shields.io/badge/status-beta-f59e0b">
</p>

**Angular UI component library** — a shadcn-style, source-first toolkit of 100
components. Fork of **PrimeNG 21.1.9** (the last MIT release before PrimeNG v22
moved to a paid license), retargeted to **Angular 22 + TypeScript 6**, with the entire
**PrimeUIX theming engine vendored in-tree**.

Published on npm as a **source registry + CLI**, not an importable library: you
`primus add` components, the CLI **copies the source into your app**, and you own
and edit every file. Components are _not_ importable from the package directly.

- **100 components**, 17 core modules, one design-token theme system.
- **Zero third-party runtime deps** beyond Angular + `tslib`. No `@primeuix/*`, no `primeng`.
- **You own the code.** Components are copied into your app; upgrades are opt-in diffs.
- Design docs: `../primus-doc` · runnable demo: `../primus-demo` · manual setup: [`INTEGRATION.md`](./INTEGRATION.md).

> **Beta channel.** `@selisedev/primus-beta` is the pre-release line; the stable
> package will be `@selisedev/primus`.

---

## Table of contents

1. [Why primus](#why-primus)
2. [Philosophy](#philosophy)
3. [Repository layout](#repository-layout)
4. [Quick start (CLI)](#quick-start-cli)
5. [CLI reference](#cli-reference)
6. [Manual integration (no CLI)](#manual-integration-no-cli)
7. [Design system & theming](#design-system--theming)
8. [The vendored PrimeUIX engine](#the-vendored-primeuix-engine)
9. [Component catalog](#component-catalog)
10. [Build & test (this repo = harness)](#build--test-this-repo--harness)
11. [Publishing model](#publishing-model)
12. [Entry-point architecture](#entry-point-architecture)
13. [Relationship to PrimeNG / PrimeUIX](#relationship-to-primeng--primeuix)
14. [Contributing](#contributing)
15. [License](#license)

---

## Why primus

PrimeNG v22 and the shared **PrimeUIX** engine moved to a commercial license, and the
PrimeUIX repository was **archived (2026-06-28)**. Existing MIT versions stay MIT forever,
but there are no more upstream fixes and future majors are closed-source.

primus freezes the last-MIT surface and makes it **ours**:

- Forked from **PrimeNG 21.1.9** (MIT) — component logic, templates, behavior.
- The five **PrimeUIX** packages (`utils`, `styled`, `styles`, `motion`, `themes`) are
  **vendored in-tree** (see [below](#the-vendored-primeuix-engine)) — no external
  `@primeuix/*` dependency, no supply-chain exposure if PrimeTek pulls npm access.
- Retargeted to **Angular 22 / TypeScript 6**, distributed the shadcn way: copy-in source,
  not an opaque npm package.

## Philosophy

| Principle                          | What it means in primus                                                                                                                         |
| ---------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| **Own your components**            | `primus add button` copies the component _source_ into your app. After that it's your code — edit freely.                                       |
| **Brand-neutral by default**       | Component CSS never hardcodes colors. It references design tokens: `dt('button.primary.color')`.                                                |
| **One theme, everything restyles** | Token _values_ live in `theme/` and flow through `definePreset` → `AppPreset` / `AppDarkPreset`. Change tokens once; all 100 components follow. |
| **Opt-in upgrades**                | `primus diff button` shows exactly what changed vs the installed package before you re-copy. No surprise breakage.                              |
| **No hidden runtime deps**         | The theming engine is vendored. `dist` runtime deps reduce to `tslib`.                                                                          |

---

## Repository layout

```
src/
  components/    100 UI components     -> @selisedev/primus-beta/components/*   (e.g. @selisedev/primus-beta/components/button)
  core/          infra + provider      -> @selisedev/primus-beta/core/*         (api, base, config, dom, utils, icons, types, …)
  theme/         design system         -> @selisedev/primus-beta/theme          (primitives, semantic, components, tokens, preset)
  primeuix/      vendored engine       -> @selisedev/primus-beta/primeuix/*      (utils, styled, styles, motion, themes)
  public_api.ts  ng-package.json                                   (root primary entry point)

cli/             primus CLI + component registry (init / add / diff / theme)
tools/           generate-theme.mjs   (optional static-CSS generator)
scripts/         build harness (prebuild / postbuild / pack-prep for ng-packagr)
angular.json  tsconfig.json  vitest setup                          (build + test config)
```

Every folder above is a secondary entry point of the one package
**`@selisedev/primus-beta`**. The **published** package trims its exports to the
`primeuix` engine only (so components/core/theme are _not_ importable — you copy
them) and ships the `src/` source + `cli/` for the copy flow; see
[Publishing model](#publishing-model) and [Entry-point architecture](#entry-point-architecture).

---

## Quick start (CLI)

primus is consumed like shadcn/ui. Install the package (source registry + CLI),
then let the CLI copy components into your app.

```bash
# 1. install — the CLI + component sources live in this dev dependency,
#    the primeuix engine ships as the only importable runtime part
pnpm add -D @selisedev/primus-beta
pnpm add primeicons              # icon font for the pi pi-* classes
#    optional peers, only if you use them: chart.js (p-chart), quill (p-editor)

# 2. init — writes primus.json ONLY (default root src/primus) + tsconfig paths.
#    Copies nothing; no folders created.
pnpm primus init                 # optional: --dir <path>

# 3. add — copies the components (+ transitive deps) into src/primus/components.
#    core/ + theme/ initialize automatically on the first add. No arg = interactive picker.
pnpm primus add button card inputtext tag
```

Align your app's `tsconfig.json` to primus's compile settings (init warns if not):

```jsonc
"compilerOptions": {
  "strict": false, "strictNullChecks": true,
  "noImplicitOverride": false, "noPropertyAccessFromIndexSignature": false
},
"angularCompilerOptions": { "strictTemplates": false }
```

Wire the provider once, in `app.config.ts`:

```ts
import { providePrimus } from '@selisedev/primus-beta/core/config';
import { AppPreset } from '@selisedev/primus-beta/theme'; // your copied theme

providePrimus({
    theme: { preset: AppPreset, options: { darkModeSelector: '.dark' } },
    ripple: true
});
```

Use components — the `@selisedev/primus-beta/components/*` specifier resolves to your
**local copies** via the tsconfig paths `init` added (not the package):

```ts
import { Button } from '@selisedev/primus-beta/components/button'; // -> src/primus/components/button
import { Card } from '@selisedev/primus-beta/components/card';

@Component({ imports: [Button, Card] /* … */ })
export class MyComponent {}
```

Edit those files freely — they're yours. `primus diff button` shows what changed vs
the package before you re-copy. Theming lives in the copied `theme/` folder
(`primitives / semantic / components / preset`) — no separate config file.

---

## CLI reference

Source of truth: the package installed at `node_modules/@selisedev/primus-beta`. The
CLI only ever **copies** from it — your app owns every file afterwards.

| Command                      | What it does                                                                                                                                                                                                                                                                                 |
| ---------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `primus init [--dir <path>]` | Writes `primus.json` **only** (default root `src/primus`, all paths derived from it) and adds the `@selisedev/primus-beta/{theme,core,components}` wildcard paths to `tsconfig(.base).json`. **Copies nothing** — no gap folders.                                                            |
| `primus add <component…>`    | Copies the component folder(s) **plus their transitive component deps** into `<root>/components`. On the **first add**, `core/` + `theme/` initialize automatically. No component named → interactive picker. `--with-specs` keeps spec files. Reports npm peers (e.g. `chart.js`, `quill`). |
| `primus diff <component>`    | Compares your local copy against the package file-by-file (`+` local-only, `-` missing, `~` modified) so upgrades are reviewable, never silent.                                                                                                                                              |
| `primus theme`               | _(optional, off the default path)_ compiles design tokens to a static `primus.theme.css`. Not needed for runtime theming, which comes from the copied `theme/` via `providePrimus`.                                                                                                          |

Dependency resolution is registry-driven (`cli/registry.json`, auto-generated by
`cli/build-registry.mjs`). Example entry:

```jsonc
"button": {
  "dir": "components/button",
  "dependencies": ["autofocus", "badge", "fluid", "ripple"]
}
```

`core/` + `theme/` initialize lazily on the first `add`, so the registry only tracks
cross-component and npm dependencies — adding a component needs no config change anywhere.

---

## Manual integration (no CLI)

If you'd rather wire it by hand (e.g. into an Nx workspace), see **[`INTEGRATION.md`](./INTEGRATION.md)**.
Summary:

1. Copy `src/*` into your app's `libs/primus/`.
2. Install app-provided peers: `@angular/cdk`, `primeicons` (icon font for the `pi pi-*`
   classes), and optionally `chart.js` / `quill` for `<p-chart>` / `<p-editor>`.
3. Add tsconfig path aliases:
    ```jsonc
    "paths": {
      "@selisedev/primus-beta/theme":        ["libs/primus/theme/public_api.ts"],
      "@selisedev/primus-beta/core/*":       ["libs/primus/core/*/public_api.ts"],
      "@selisedev/primus-beta/components/*": ["libs/primus/components/*/public_api.ts"],
      "@selisedev/primus-beta/primeuix/*":   ["libs/primus/primeuix/*"]
    }
    ```
4. Swap `primeng/*` imports for `@selisedev/primus-beta/*` (the doc includes a `perl` sweep).

No `@primeuix/*` install is required — the theming engine is vendored in-tree.

---

## Design system & theming

Components are **brand-neutral**: their `*/style/*style.ts` files pull CSS from
`@selisedev/primus-beta/primeuix/styles/<component>` as strings of `dt('token.name')` — never literal colors.
The token _values_ are your design system, defined under `src/theme/`:

```
theme/
  primitives/    raw scales (color ramps, spacing, radii, typography, breakpoints)
  semantic/      role tokens (surface, primary, text, …) for light + dark
  components/    per-component token overrides
  tokens/        app-level tokens (brand colors)
  preset.ts      definePreset(...) -> AppPreset (light) + AppDarkPreset (dark)
```

`preset.ts` composes them:

```ts
export const AppPreset = definePreset({
    primitive: { ...primitives, ...typography, ...spacing },
    semantic: { ...semanticLight, ...appColors },
    components
});
```

Edit tokens in `theme/` and **every component restyles** — no per-component CSS edits.
The runtime engine (`@selisedev/primus-beta/primeuix/styled`) turns preset tokens into CSS variables;
`primus theme` can also compile them to a static stylesheet.

primus ships **its own** preset only — the upstream Aura / Lara / Material / Nora presets
are intentionally **not** included.

---

## The vendored PrimeUIX engine

The five MIT PrimeUIX packages are forked in-tree under `src/primeuix/`, exposed as
`@selisedev/primus-beta/primeuix/*` secondary entry points. primus owns the full stack; there is **no
external `@primeuix/*` runtime dependency**.

| Vendored package | Entry point                                          | Role                                                                      |
| ---------------- | ---------------------------------------------------- | ------------------------------------------------------------------------- |
| `utils`          | `@selisedev/primus-beta/primeuix/utils`              | DOM / object / event helpers (single bundled entry point)                 |
| `styled`         | `@selisedev/primus-beta/primeuix/styled`             | Theming engine: `definePreset`, `$dt`, `ThemeService` — tokens → CSS vars |
| `styles`         | `@selisedev/primus-beta/primeuix/styles/<component>` | Per-component CSS-in-JS token strings (97 entry points)                   |
| `motion`         | `@selisedev/primus-beta/primeuix/motion`             | Enter/leave animation helpers                                             |
| `themes`         | `@selisedev/primus-beta/primeuix/themes`             | `definePreset` wrapper + design-token types (presets stripped)            |

**Slimming:** the ~7 MB of shipped theme presets (Aura/Lara/Material/Nora) are dropped;
only the `definePreset` engine and design-token types are kept, since primus uses its own
`AppPreset`.

Each vendored directory keeps its upstream MIT `LICENSE`. Fork provenance and licensing
are recorded in `NOTICE.md`.

---

## Component catalog

100 components, each a standalone entry point at `@selisedev/primus-beta/components/<name>`.

**Form & input** — autocomplete · cascadeselect · checkbox · colorpicker · datepicker ·
editor · floatlabel · fluid · iconfield · iftalabel · inputgroup · inputgroupaddon ·
inputmask · inputnumber · inputotp · inputtext · keyfilter · knob · listbox · multiselect ·
password · radiobutton · rating · select · selectbutton · slider · textarea · togglebutton ·
toggleswitch · treeselect

**Buttons** — button · buttongroup · speeddial · splitbutton

**Data** — dataview · orderlist · organizationchart · paginator · picklist · table ·
timeline · tree · treetable · scroller (virtual scroll)

**Panel** — accordion · card · divider · fieldset · panel · scrollpanel · splitter ·
stepper · tabs · toolbar

**Overlay** — confirmdialog · confirmpopup · dialog · drawer · dynamicdialog · overlay ·
popover · tooltip

**Menu** — breadcrumb · contextmenu · dock · megamenu · menu · menubar · panelmenu ·
steps · tieredmenu

**Media** — carousel · galleria · image · imagecompare · fileupload

**Messages** — message · toast

**Chart** — chart _(peer: `chart.js`)_

**Misc** — avatar · avatargroup · badge · blockui · chip · inplace · metergroup ·
overlaybadge · progressbar · progressspinner · scrolltop · skeleton · tag · terminal

**Directives** — animateonscroll · autofocus · dragdrop · focustrap · ripple · styleclass

**Core modules** (`@selisedev/primus-beta/core/*`) — api · base · basecomponent · baseeditableholder ·
baseinput · basemodelholder · bind · classnames · config · dom · icons · motion ·
passthrough · ts-helpers · types · usestyle · utils

---

## Build & test (this repo = harness)

This repository is the **authoring/build harness**. It compiles the library and runs the
tests; apps consume the built package via the CLI.

```bash
pnpm install
pnpm build     # ng-packagr -> dist/, 361 secondary entry points
pnpm test      # vitest (jsdom)
```

| Script                               | Purpose                                                  |
| ------------------------------------ | -------------------------------------------------------- |
| `pnpm build`                         | `build:prebuild` → `ng build primus` → `build:postbuild` |
| `pnpm test` / `test:unit`            | `ng test primus` (Vitest + jsdom)                        |
| `pnpm test:unit:watch` / `:coverage` | watch / coverage runs                                    |
| `pnpm lint`                          | `ng lint`                                                |
| `pnpm format` / `format:check`       | Prettier                                                 |
| `pnpm clean`                         | wipe `node_modules`, `dist`, `.angular`, lockfile        |

Build outputs to `dist/` (git-ignored). `dist/package.json` runtime deps are **`tslib` only**.

---

## Publishing model

The published npm package is a **source registry + CLI**, produced by `pnpm run
release:beta` (build → `scripts/pack-prep.mjs` → `npm publish ./dist`):

- **Exports trimmed to the `primeuix` engine only.** `@selisedev/primus-beta/components|core|theme/*`
  are deliberately **not** importable from the package — resolving them fails with
  `ERR_PACKAGE_PATH_NOT_EXPORTED` until `primus init` remaps those specifiers to your
  local copies. This enforces copy-and-own; the engine stays importable because the
  copied components need it at runtime.
- **Ships `src/` source + `cli/` + `bin`** so the CLI can copy components/core/theme
  and `pnpm primus` works.
- Runtime deps reduce to `tslib`; Angular + `primeicons` are peers.

Versioning: `@selisedev/primus-beta` is the beta channel (`0.0.x`); the stable line
will be `@selisedev/primus`.

---

## Entry-point architecture

primus is a multi-entry [ng-packagr](https://github.com/ng-packagr/ng-packagr) library.
The built package keeps its npm name **`@selisedev/primus-beta`**, so every subdirectory
containing an `ng-package.json` becomes a secondary entry point named `@selisedev/primus-beta/<path>`.
That's why sources import each other as `@selisedev/primus-beta/core/api`, `@selisedev/primus-beta/components/button`,
`@selisedev/primus-beta/primeuix/styled` — each resolves to a sibling entry point rather than falling back
to raw source (which would trip ng-packagr's `rootDir` guard).

Rules that keep it building:

- A directory imported via a **subpath** specifier (`@selisedev/primus-beta/primeuix/styles/button`) needs
  its own `ng-package.json`. A directory imported **relatively** (`../config`) is inlined —
  never both across an entry-point boundary.
- `utils` is a **single** entry point (subfolders inlined; barrel uses relative imports).
- `styles` is **per-component** (97 leaf entry points).
- `themes/types` are plain `.ts` (not `.d.ts`) so the DTS bundler can trace them.

The whole graph is self-contained: 361 bundles, ~200 internal cross-imports, **zero**
external `@primeuix` references.

---

## Relationship to PrimeNG / PrimeUIX

|                 | Upstream                                  | primus                                                                                                      |
| --------------- | ----------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| Component logic | PrimeNG 21.1.9 (MIT)                      | forked, retargeted to Angular 22 / TS 6                                                                     |
| Theming engine  | `@primeuix/*` (archived, went commercial) | vendored in-tree as `@selisedev/primus-beta/primeuix/*` (MIT fork)                                          |
| Distribution    | npm package `primeng`                     | source, copied by the `primus` CLI                                                                          |
| Import prefix   | `primeng/*`, `@primeuix/*`                | `@selisedev/primus-beta/components/*`, `@selisedev/primus-beta/core/*`, `@selisedev/primus-beta/primeuix/*` |
| Theme presets   | Aura / Lara / Material / Nora             | primus `AppPreset` only                                                                                     |

The package version (`21.1.9`) tracks the PrimeNG release it forked.

---

## Contributing

Contributions are welcome — bug fixes, ported MIT-era upstream fixes, docs, and tests.

- **[CONTRIBUTING.md](./CONTRIBUTING.md)** — dev setup, project layout, coding
  standards, commit conventions, and the PR checklist.
- **[CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md)** — community expectations.
- **[SECURITY.md](./SECURITY.md)** — how to report a vulnerability (privately).
- **[CHANGELOG.md](./CHANGELOG.md)** — release history (Keep a Changelog + SemVer).

Quick loop:

```bash
pnpm install
pnpm format && pnpm lint && pnpm test    # before every PR
node cli/build-registry.mjs              # if you changed component/npm deps
```

Open an issue before large changes so scope can be agreed up front. Issue tracker:
<https://github.com/kinleyrabgay/primus/issues>.

---

## License

**MIT.** primus is a fork of PrimeNG 21.1.9 (MIT) and PrimeUIX (MIT). See
[`LICENSE.md`](./LICENSE.md) and [`NOTICE.md`](./NOTICE.md) — retain both on redistribution,
including internal copies. Each vendored package under `src/primeuix/` keeps its own upstream
`LICENSE` file.
