// @primus/theme — theming engine + the design system.
//
// primus components are brand-neutral: their CSS references design tokens
// (dt('button.primary.color') ...). The token *values* come from the preset
// below, which you edit in primitives / semantic / components / tokens.
//
//   import { providePrimus } from '@primus/core/config';
//   import { AppPreset }     from '@primus/theme';
//   providePrimus({ theme: { preset: AppPreset, options: {...} }, ripple: true });

// engine + helpers: definePreset, palette, updatePreset, $dt, usePreset, ...
export * from '@primeuix/themes';

// base presets to extend
export { default as Aura } from '@primeuix/themes/aura';
export { default as Lara } from '@primeuix/themes/lara';
export { default as Material } from '@primeuix/themes/material';
export { default as Nora } from '@primeuix/themes/nora';

// the design system — everything, so `@primus/theme` is the single import site
export * from './preset'; // AppPreset, AppDarkPreset
export * from './primitives'; // primitives, typography, spacing, breakpoints
export * from './semantic'; // semanticLight, semanticDark, baseSemantic, lightTheme, darkTheme
export * from './tokens/app.colors'; // appColors, AppColors
export * from './components'; // components — per-component token overrides
