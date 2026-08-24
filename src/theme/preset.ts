import { definePreset } from '@selisedev/primus-beta/primeuix/themes';
import type { ComponentsDesignTokens } from '@selisedev/primus-beta/primeuix/themes';

import { semanticDark, semanticLight } from './semantic/index';
import { appColors } from './tokens/app.colors';
import { components as rawComponents } from './components';
import { primitives, spacing, typography } from './primitives';

// Custom design tokens (e.g. progressspinner `color.N`, string radii) are valid
// PrimeNG runtime tokens but exceed @selisedev/primus-beta/primeuix/themes v3's stricter static types.
const components = rawComponents as unknown as ComponentsDesignTokens;

/**
 * Main Application Theme Preset (Light theme)
 */
export const AppPreset = definePreset({
  primitive: {
    ...primitives,
    ...typography,
    ...spacing,
  },
  semantic: {
    ...semanticLight,
    ...appColors,
  },
  components,
});

/**
 * Dark Theme Preset (uses semantic/ structure)
 */
export const AppDarkPreset = definePreset({
  primitive: {
    ...primitives,
    ...typography,
    ...spacing,
  },
  semantic: {
    ...semanticDark,
    ...appColors,
  },
  components,
});
