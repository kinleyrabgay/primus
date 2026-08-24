# @selise/primus

**Internal Angular UI component library** — a shadcn-style, source-first toolkit of
100 components. Fork of **PrimeNG 21.1.9** (the last MIT release before PrimeNG v22
moved to a paid license), retargeted to **Angular 22 + TypeScript 6**, with the entire
**PrimeUIX theming engine vendored in-tree**. Consumed as *source* through the `primus`
CLI — the app owns every file it copies. Never published to npm.

- **100 components**, 17 core modules, one design-token theme system.
- **Zero third-party runtime deps** beyond Angular + `tslib`. No `@primeuix/*`, no `primeng`.
- **You own the code.** Components are copied into your app; upgrades are opt-in diffs.
- Design docs: `../primus-doc` · runnable demo: `../primus-demo` · manual setup: [`INTEGRATION.md`](./INTEGRATION.md).

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
11. [Entry-point architecture](#entry-point-architecture)
12. [Relationship to PrimeNG / PrimeUIX](#relationship-to-primeng--primeuix)
13. [License](#license)

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

| Principle | What it means in primus |
|---|---|
| **Own your components** | `primus add button` copies the component *source* into your app. After that it's your code — edit freely. |
| **Brand-neutral by default** | Component CSS never hardcodes colors. It references design tokens: `dt('button.primary.color')`. |
| **One theme, everything restyles** | Token *values* live in `theme/` and flow through `definePreset` → `AppPreset` / `AppDarkPreset`. Change tokens once; all 100 components follow. |
| **Opt-in upgrades** | `primus diff button` shows exactly what changed vs the installed package before you re-copy. No surprise breakage. |
| **No hidden runtime deps** | The theming engine is vendored. `dist` runtime deps reduce to `tslib`. |

---

## Repository layout

```
src/
  components/    100 UI components     -> @primus/components/*   (e.g. @primus/components/button)
  core/          infra + provider      -> @primus/core/*         (api, base, config, dom, utils, icons, types, …)
  theme/         design system         -> @primus/theme          (primitives, semantic, components, tokens, preset)
  primeuix/      vendored engine       -> @primus/primeuix/*      (utils, styled, styles, motion, themes)
  public_api.ts  ng-package.json                                   (root primary entry point)

cli/             primus CLI + component registry (init / add / diff / theme)
tools/           generate-theme.mjs   (compiles primus.config.ts -> static CSS)
scripts/         build harness (prebuild / postbuild for ng-packagr)
angular.json  tsconfig.json  vitest setup                          (build + test config)
```

The published/built package (`dist/`) is renamed **`@primus`** so every folder above is a
secondary entry point of one package — `@primus/components/button`, `@primus/core/config`,
`@primus/primeuix/styled`, and so on. See [Entry-point architecture](#entry-point-architecture).

---

## Quick start (CLI)

primus is consumed like shadcn/ui: install the package as a **git devDependency**, then let
the CLI copy source into your app.

```bash
# 1. add the built primus package as a git devDependency — the CLI copies from
#    node_modules/@primus (source of truth). Install spec depends on how the
#    package is published/pinned in your org.
pnpm add -D <primus-git-dep>

# 2. scaffold: writes primus.json, copies core/ + theme entry, wires tsconfig paths
pnpm primus init            # optional: --dir libs/primus

# 3. add the components you need — transitive deps are pulled in automatically
pnpm primus add button table dialog

# 4. generate the theme CSS from your primus.config.ts
pnpm primus theme
```

Then wire the provider once, in `app.config.ts`:

```ts
import { providePrimus } from '@primus/core/config';
import { AppPreset }     from '@primus/theme';

providePrimus({
  theme: { preset: AppPreset, options: { darkModeSelector: '.dark' } },
  ripple: true,
});
```

Use components as standalone imports:

```ts
import { Button } from '@primus/components/button';
import { Table }  from '@primus/components/table';

@Component({ imports: [Button, Table], /* … */ })
export class MyComponent {}
```

---

## CLI reference

Source of truth: the primus package installed at `node_modules/@primus`. The CLI only ever
**copies** from it — your app owns every file afterwards.

| Command | What it does |
|---|---|
| `primus init [--dir <path>]` | Scaffolds `primus.json`, copies `core/` (all infra modules) and the `theme/` entry wholesale, and adds `@primus/*` wildcard paths to `tsconfig.base.json` / `tsconfig.json` **once**. Default dir `libs/primus`. |
| `primus add <component…>` | Copies the component folder(s) **plus their transitive component dependencies** into the app. Spec files are skipped unless `--with-specs`. Reports any npm peers to install (e.g. `chart.js`, `quill`). |
| `primus theme` | Compiles your `primus.config.ts` design tokens into a static `primus.theme.css`, generating structural CSS only for the components actually installed. |
| `primus diff <component>` | Compares your local copy against the installed package file-by-file (`+` local-only, `-` missing, `~` modified) so upgrades are reviewable, never silent. |

Dependency resolution is registry-driven (`cli/registry.json`, auto-generated by
`cli/build-registry.mjs`). Example entry:

```jsonc
"button": {
  "dir": "components/button",
  "dependencies": ["autofocus", "badge", "fluid", "ripple"]
}
```

`core/` and `theme/` are installed wholesale by `init`, so the registry only tracks
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
     "@primus/theme":        ["libs/primus/theme/public_api.ts"],
     "@primus/core/*":       ["libs/primus/core/*/public_api.ts"],
     "@primus/components/*": ["libs/primus/components/*/public_api.ts"],
     "@primus/primeuix/*":   ["libs/primus/primeuix/*"]
   }
   ```
4. Swap `primeng/*` imports for `@primus/*` (the doc includes a `perl` sweep).

No `@primeuix/*` install is required — the theming engine is vendored in-tree.

---

## Design system & theming

Components are **brand-neutral**: their `*/style/*style.ts` files pull CSS from
`@primus/primeuix/styles/<component>` as strings of `dt('token.name')` — never literal colors.
The token *values* are your design system, defined under `src/theme/`:

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
  semantic:  { ...semanticLight, ...appColors },
  components,
});
```

Edit tokens in `theme/` and **every component restyles** — no per-component CSS edits.
The runtime engine (`@primus/primeuix/styled`) turns preset tokens into CSS variables;
`primus theme` can also compile them to a static stylesheet.

primus ships **its own** preset only — the upstream Aura / Lara / Material / Nora presets
are intentionally **not** included.

---

## The vendored PrimeUIX engine

The five MIT PrimeUIX packages are forked in-tree under `src/primeuix/`, exposed as
`@primus/primeuix/*` secondary entry points. primus owns the full stack; there is **no
external `@primeuix/*` runtime dependency**.

| Vendored package | Entry point | Role |
|---|---|---|
| `utils` | `@primus/primeuix/utils` | DOM / object / event helpers (single bundled entry point) |
| `styled` | `@primus/primeuix/styled` | Theming engine: `definePreset`, `$dt`, `ThemeService` — tokens → CSS vars |
| `styles` | `@primus/primeuix/styles/<component>` | Per-component CSS-in-JS token strings (97 entry points) |
| `motion` | `@primus/primeuix/motion` | Enter/leave animation helpers |
| `themes` | `@primus/primeuix/themes` | `definePreset` wrapper + design-token types (presets stripped) |

**Slimming:** the ~7 MB of shipped theme presets (Aura/Lara/Material/Nora) are dropped;
only the `definePreset` engine and design-token types are kept, since primus uses its own
`AppPreset`.

Each vendored directory keeps its upstream MIT `LICENSE`. Fork provenance and licensing
are recorded in `NOTICE.md`.

---

## Component catalog

100 components, each a standalone entry point at `@primus/components/<name>`.

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

**Chart** — chart *(peer: `chart.js`)*

**Misc** — avatar · avatargroup · badge · blockui · chip · inplace · metergroup ·
overlaybadge · progressbar · progressspinner · scrolltop · skeleton · tag · terminal

**Directives** — animateonscroll · autofocus · dragdrop · focustrap · ripple · styleclass

**Core modules** (`@primus/core/*`) — api · base · basecomponent · baseeditableholder ·
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

| Script | Purpose |
|---|---|
| `pnpm build` | `build:prebuild` → `ng build primus` → `build:postbuild` |
| `pnpm test` / `test:unit` | `ng test primus` (Vitest + jsdom) |
| `pnpm test:unit:watch` / `:coverage` | watch / coverage runs |
| `pnpm lint` | `ng lint` |
| `pnpm format` / `format:check` | Prettier |
| `pnpm clean` | wipe `node_modules`, `dist`, `.angular`, lockfile |

Build outputs to `dist/` (git-ignored). `dist/package.json` runtime deps are **`tslib` only**.

---

## Entry-point architecture

primus is a multi-entry [ng-packagr](https://github.com/ng-packagr/ng-packagr) library.
`scripts/build-helper.mjs` renames the built package to **`@primus`** so every subdirectory
containing an `ng-package.json` becomes a secondary entry point named `@primus/<path>`.
That's why sources import each other as `@primus/core/api`, `@primus/components/button`,
`@primus/primeuix/styled` — each resolves to a sibling entry point rather than falling back
to raw source (which would trip ng-packagr's `rootDir` guard).

Rules that keep it building:

- A directory imported via a **subpath** specifier (`@primus/primeuix/styles/button`) needs
  its own `ng-package.json`. A directory imported **relatively** (`../config`) is inlined —
  never both across an entry-point boundary.
- `utils` is a **single** entry point (subfolders inlined; barrel uses relative imports).
- `styles` is **per-component** (97 leaf entry points).
- `themes/types` are plain `.ts` (not `.d.ts`) so the DTS bundler can trace them.

The whole graph is self-contained: 361 bundles, ~200 internal cross-imports, **zero**
external `@primeuix` references.

---

## Relationship to PrimeNG / PrimeUIX

| | Upstream | primus |
|---|---|---|
| Component logic | PrimeNG 21.1.9 (MIT) | forked, retargeted to Angular 22 / TS 6 |
| Theming engine | `@primeuix/*` (archived, went commercial) | vendored in-tree as `@primus/primeuix/*` (MIT fork) |
| Distribution | npm package `primeng` | source, copied by the `primus` CLI |
| Import prefix | `primeng/*`, `@primeuix/*` | `@primus/components/*`, `@primus/core/*`, `@primus/primeuix/*` |
| Theme presets | Aura / Lara / Material / Nora | primus `AppPreset` only |

The package version (`21.1.9`) tracks the PrimeNG release it forked.

---

## License

**MIT.** primus is a fork of PrimeNG 21.1.9 (MIT) and PrimeUIX (MIT). See
[`LICENSE.md`](./LICENSE.md) and [`NOTICE.md`](./NOTICE.md) — retain both on redistribution,
including internal copies. Each vendored package under `src/primeuix/` keeps its own upstream
`LICENSE` file.
