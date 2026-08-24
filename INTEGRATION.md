# Integrating @primus into the Nx app

## Lib layout
```
libs/primus/                 (copy this repo's src/ contents here)
  components/   button, table, dialog, ... (~100)   -> @primus/components/*
  core/         api, base, config (provider), dom,
                utils, bind, icons, types, ...       -> @primus/core/*
  theme/        design system (editable)             -> @primus/theme
  public_api.ts  ng-package.json                     (root primary entry)
```

## 1. Install runtime deps in the app
```
pnpm add @angular/cdk primeicons
# optional — only if you use <p-chart> / <p-editor>
pnpm add chart.js quill
```
(@angular/core, common, forms, platform-browser, router, rxjs already present.)
No `@primeuix/*` install — the theming engine (utils/styled/styles/motion/themes)
is vendored in-tree under `libs/primus/primeuix/` as `@primus/primeuix/*` entry
points. `primeicons` supplies the icon font for the `pi pi-*` classes primus emits.

## 2. Path aliases in tsconfig.base.json
```jsonc
"paths": {
  "@primus/theme":        ["libs/primus/theme/public_api.ts"],
  "@primus/core/*":       ["libs/primus/core/*/public_api.ts"],
  "@primus/components/*": ["libs/primus/components/*/public_api.ts"],
  "@primus/primeuix/*":   ["libs/primus/primeuix/*"]
}
```
`@primus/core/*` also covers types (`@primus/core/types/button`) and icons
(`@primus/core/icons/baseicon`) via the wildcard. `@primus/primeuix/*` is the
vendored theming engine (utils/styled/styles/motion/themes) — resolves to source,
no external `@primeuix/*` package.

## 3. Import mapping — swap in every app file
| PrimeNG (old) | primus (new) |
|---|---|
| `primeng/config` → `providePrimeNG` | `@primus/core/config` → `providePrimus` |
| `primeng/api` (`MessageService`, `PrimeTemplate`) | `@primus/core/api` |
| `primeng/dynamicdialog` (`DialogService`) | `@primus/components/dynamicdialog` |
| `primeng/button`, `primeng/table`, … | `@primus/components/button`, `@primus/components/table` |
| `@primeng/themes` / `@primeuix/themes` (`definePreset`) | `@primus/theme` (or `@primus/primeuix/themes`) |

Mechanical sweep across the app — components vs infra split:
```
# UI widgets -> components/   (edit the list to your usage, or map all then fix the few infra ones)
grep -rl "from 'primeng/" src | xargs perl -pi -e "s#from 'primeng/(config|api|dom|utils|base\w*)#from '\@primus/core/\$1#g"
grep -rl "from 'primeng/" src | xargs perl -pi -e "s#from 'primeng/#from '\@primus/components/#g"
grep -rl "providePrimeNG"   src | xargs perl -pi -e "s#providePrimeNG#providePrimus#g"
```

## 4. app.config.ts — only import sources change
```ts
import { providePrimus }  from '@primus/core/config';
import { MessageService } from '@primus/core/api';
import { DialogService }  from '@primus/components/dynamicdialog';
import { AppPreset }      from '@primus/theme';   // design system, editable in libs/primus/theme

providePrimus({
  theme: {
    preset: AppPreset,
    options: { cssLayer: { name: 'primeng', order: 'theme, base, primeng' }, darkModeSelector: false },
  },
  ripple: true,
})
```
Config shape is identical to `providePrimeNG`. Your preset passes through unchanged.

## Where the design system lives
- **`@primus/components/*`** — brand-neutral. Each `*/style/*style.ts` pulls CSS from
  `@primus/primeuix/styles/<component>` — strings of `dt('token.name')`, never literal colors.
- **`@primus/theme`** — `primitives / semantic / components / tokens` → `definePreset`
  → `AppPreset` / `AppDarkPreset`. Edit here to restyle everything. Paste your existing
  `@sbh/themes` content into these folders.
- **`@primus/primeuix/styled`** — vendored engine: turns preset tokens into CSS variables
  at runtime. Forked in-tree from archived MIT PrimeUIX; primus owns it (no external dep).
