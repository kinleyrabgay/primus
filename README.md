# @selise/primus

Internal Angular UI component library. Fork of **PrimeNG 21.1.9** (MIT — the last
MIT release before PrimeNG v22 moved to a paid license), retargeted to **Angular 22 +
TypeScript 6**. Consumed as source via the `primus` CLI; never published to npm.

Design docs live in `../primus-doc`; a runnable demo in `../primus-demo`.

## Layout
```
src/
  components/   UI components        -> @primus/components/*   (e.g. @primus/components/button)
  core/         infra + provider     -> @primus/core/*         (api, base, config, dom, utils, icons, types ...)
  theme/        design system        -> @primus/theme          (primitives, semantic, components, tokens, preset)
  public_api.ts  ng-package.json
angular.json  tsconfig.json  karma.conf.js  scripts/           (build + test harness)
```

## Build & test (this repo = harness)
```
pnpm install
pnpm build     # ng-packagr -> dist/, 263 entry points
pnpm test      # karma (needs Chrome; set CHROME_BIN if not auto-detected)
```

## Use in the app
See **INTEGRATION.md** — copy `src/*` into the Nx app's `libs/primus/`, add three
tsconfig paths, install `@primeuix/*`, swap `primeng/*` imports for `@primus/*`.

```ts
import { providePrimus } from '@primus/core/config';
import { AppPreset }     from '@primus/theme';
providePrimus({ theme: { preset: AppPreset, options: {...} }, ripple: true });
```

## Design system
Components are brand-neutral — their CSS references design tokens (`dt('button.primary.color')`),
never literal colors. Token values live in `src/theme` (`definePreset` → `AppPreset` /
`AppDarkPreset`). Edit tokens there; every component restyles. The theming engine is
`@primeuix/*` (MIT, pinned — an engine peer like Angular, not vendored).

## License
MIT. See `LICENSE.md` and `NOTICE.md` (retain both on redistribution, including internal copies).
