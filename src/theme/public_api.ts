// @selisedev/primus-beta/theme — theming engine + the design system.
//
// primus components are brand-neutral: their CSS references design tokens
// (dt('button.primary.color') ...). The token *values* come from the preset
// below, which you edit in primitives / semantic / components / tokens.
//
//   import { providePrimus } from '@selisedev/primus-beta/core/config';
//   import { AppPreset }     from '@selisedev/primus-beta/theme';
//   providePrimus({ theme: { preset: AppPreset, options: {...} }, ripple: true });

// engine + helpers: definePreset, palette, updatePreset, $dt, usePreset, ...
export * from '@selisedev/primus-beta/primeuix/themes';

// NOTE: PrimeUIX base presets (Aura/Lara/Material/Nora) intentionally NOT
// re-exported. primus vendors only the theming engine; its design system is
// AppPreset (below), built from primus's own primitives/semantic/components.

// the design system — everything, so `@selisedev/primus-beta/theme` is the single import site
export * from './preset'; // AppPreset, AppDarkPreset
export * from './primitives'; // primitives, typography, spacing, breakpoints
export * from './semantic'; // semanticLight, semanticDark, baseSemantic, lightTheme, darkTheme
export * from './tokens/app.colors'; // appColors, AppColors
export * from './components'; // components — per-component token overrides
