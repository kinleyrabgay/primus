import * as Styled from '@primus/primeuix/styled';
import type { PaletteDesignToken, Preset, Theme } from './types';

// Re-export the design-token types so consumers reach them via
// '@primus/primeuix/themes' (the ./types tree is type-only .d.ts, not its own
// ng-packagr entry point). Narrow re-export: styled already exports Theme etc.,
// so a blanket `export * from './types'` would clash.
export type { ComponentsDesignTokens } from './types';

export const definePreset = (...presets: Preset[]) => Styled.definePreset(...presets);
export const updatePreset = (...presets: Preset[]) => Styled.updatePreset(...presets);
export const updatePrimaryPalette = (palette?: PaletteDesignToken) => Styled.updatePrimaryPalette<PaletteDesignToken, Preset>(palette);
export const updateSurfacePalette = (palette?: PaletteDesignToken) => Styled.updateSurfacePalette<PaletteDesignToken, Preset>(palette);
export const usePreset = (...presets: Preset[]) => Styled.usePreset(...presets);
export const useTheme = (theme: Theme) => Styled.useTheme(theme);

export * from '@primus/primeuix/styled';
