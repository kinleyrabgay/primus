import { darkTheme } from './theme.dark';
import { lightTheme } from './theme.light';
import { baseSemantic } from './tokens';

/**
 * Combined Light Theme (default)
 */
export const semanticLight = {
  ...baseSemantic,
  colorScheme: {
    ...lightTheme.colorScheme,
    // Optionally include dark theme colorScheme for reference
    dark: darkTheme.colorScheme.dark,
  },
} as const;

/**
 * Combined Dark Theme
 */
export const semanticDark = {
  ...baseSemantic,
  colorScheme: {
    light: lightTheme.colorScheme.light, // For reference
    ...darkTheme.colorScheme,
  },
} as const;

/**
 * Export individual parts
 */
export { baseSemantic, darkTheme,lightTheme };
export type SemanticTokens = typeof baseSemantic;
