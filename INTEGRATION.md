# Integrating @primus into the Nx app

## Lib layout

```
libs/primus/                 (copy this repo's src/ contents here)
  components/   button, table, dialog, ... (~100)   -> @selisedev/primus-beta/components/*
  core/         api, base, config (provider), dom,
                utils, bind, icons, types, ...       -> @selisedev/primus-beta/core/*
  theme/        design system (editable)             -> @selisedev/primus-beta/theme
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
is vendored in-tree under `libs/primus/primeuix/` as `@selisedev/primus-beta/primeuix/*` entry
points. `primeicons` supplies the icon font for the `pi pi-*` classes primus emits.

## 2. Path aliases in tsconfig.base.json

```jsonc
"paths": {
  "@selisedev/primus-beta/theme":        ["libs/primus/theme/public_api.ts"],
  "@selisedev/primus-beta/core/*":       ["libs/primus/core/*/public_api.ts"],
  "@selisedev/primus-beta/components/*": ["libs/primus/components/*/public_api.ts"],
  "@selisedev/primus-beta/primeuix/*":   ["libs/primus/primeuix/*"]
}
```

`@selisedev/primus-beta/core/*` also covers types (`@selisedev/primus-beta/core/types/button`) and icons
(`@selisedev/primus-beta/core/icons/baseicon`) via the wildcard. `@selisedev/primus-beta/primeuix/*` is the
vendored theming engine (utils/styled/styles/motion/themes) — resolves to source,
no external `@primeuix/*` package.

## 3. Import mapping — swap in every app file

| PrimeNG (old)                                           | primus (new)                                                                          |
| ------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| `primeng/config` → `providePrimeNG`                     | `@selisedev/primus-beta/core/config` → `providePrimus`                                |
| `primeng/api` (`MessageService`, `PrimeTemplate`)       | `@selisedev/primus-beta/core/api`                                                     |
| `primeng/dynamicdialog` (`DialogService`)               | `@selisedev/primus-beta/components/dynamicdialog`                                     |
| `primeng/button`, `primeng/table`, …                    | `@selisedev/primus-beta/components/button`, `@selisedev/primus-beta/components/table` |
| `@primeng/themes` / `@primeuix/themes` (`definePreset`) | `@selisedev/primus-beta/theme` (or `@selisedev/primus-beta/primeuix/themes`)          |

Mechanical sweep across the app — components vs infra split:

```
# UI widgets -> components/   (edit the list to your usage, or map all then fix the few infra ones)
grep -rl "from 'primeng/" src | xargs perl -pi -e "s#from 'primeng/(config|api|dom|utils|base\w*)#from '\@selisedev/primus-beta/core/\$1#g"
grep -rl "from 'primeng/" src | xargs perl -pi -e "s#from 'primeng/#from '\@selisedev/primus-beta/components/#g"
grep -rl "providePrimeNG"   src | xargs perl -pi -e "s#providePrimeNG#providePrimus#g"
```

## 4. app.config.ts — only import sources change

```ts
import { providePrimus } from '@selisedev/primus-beta/core/config';
import { MessageService } from '@selisedev/primus-beta/core/api';
import { DialogService } from '@selisedev/primus-beta/components/dynamicdialog';
import { AppPreset } from '@selisedev/primus-beta/theme'; // design system, editable in libs/primus/theme

providePrimus({
    theme: {
        preset: AppPreset,
        options: { cssLayer: { name: 'primeng', order: 'theme, base, primeng' }, darkModeSelector: false }
    },
    ripple: true
});
```

Config shape is identical to `providePrimeNG`. Your preset passes through unchanged.

## Where the design system lives

- **`@selisedev/primus-beta/components/*`** — brand-neutral. Each `*/style/*style.ts` pulls CSS from
  `@selisedev/primus-beta/primeuix/styles/<component>` — strings of `dt('token.name')`, never literal colors.
- **`@selisedev/primus-beta/theme`** — `primitives / semantic / components / tokens` → `definePreset`
  → `AppPreset` / `AppDarkPreset`. Edit here to restyle everything. Paste your existing
  `@sbh/themes` content into these folders.
- **`@selisedev/primus-beta/primeuix/styled`** — vendored engine: turns preset tokens into CSS variables
  at runtime. Forked in-tree from archived MIT PrimeUIX; primus owns it (no external dep).
