/**
 * primus.config.ts — the single design-system entry for an app using primus.
 *
 * This is the STARTER TEMPLATE that `primus init` copies into the consuming app
 * (the './src/theme/…' imports are rewritten to the app's primus folder).
 * Everything visual is defined (or re-exported) here: typography, color scales,
 * spacing, semantic mappings and per-component token overrides. Running
 * `primus theme` compiles it into a static `primus.theme.css` — no runtime
 * theming engine, no presets in the app.
 *
 * The bulk of the tokens starts out in the copied theme/* modules so day-one
 * output is identical to the runtime preset; inline values into this file over
 * time — the shape below is the contract, not the file layout.
 */
import { primitives, spacing, typography } from './src/theme/primitives';
import { semanticLight } from './src/theme/semantic';
import { appColors } from './src/theme/tokens/app.colors';
import { components } from './src/theme/components';

export interface PrimusConfig {
    /** CSS variable prefix: 'p' -> --p-button-border-radius */
    prefix: string;
    /** Selector that switches the dark scheme, shadcn-style */
    darkModeSelector: string | false;
    /** Optional CSS cascade layer, e.g. { name: 'primus', order: 'theme, base, primus' } */
    cssLayer: false | { name: string; order?: string };
    /** Primitive tokens */
    typography: Record<string, unknown>;
    spacing: Record<string, unknown>;
    colors: Record<string, unknown>;
    /** App-specific named colors, exposed as --p-<name> */
    appColors: Record<string, string>;
    /** Semantic mappings (includes light + dark colorScheme) */
    semantic: Record<string, unknown>;
    /** Per-component token overrides */
    components: Record<string, unknown>;
}

const config: PrimusConfig = {
    prefix: 'p',
    darkModeSelector: '.dark',
    cssLayer: false,

    typography,
    spacing,
    colors: primitives,
    appColors: appColors as Record<string, string>,
    semantic: semanticLight,
    components
};

export default config;
