/**
 * Primitive Color Scales
 * Raw, non-semantic values. Never reference other tokens.
 * PrimeNG will expose them as: --p-<token>-<scale>
 */

export const primitives = {
    borderRadius: {
        none: '0',
        xs: '2px',
        sm: '4px',
        md: '6px',
        lg: '8px',
        xl: '12px'
    },

    // Main brand color palette (Red)
    main: {
        50: '#fef2f2',
        100: '#fee2e2',
        200: '#fecaca',
        300: '#fca5a5',
        400: '#f87171',
        500: '#DA2A1C',
        600: '#dc2626',
        700: '#b91c1c',
        800: '#991b1b',
        900: '#7f1d1d'
    },

    // Success color palette (green)
    green: {
        50: '#f0fdf4',
        100: '#dcfce7',
        200: '#bbf7d0',
        300: '#86efac',
        400: '#4ade80',
        500: '#22c55e',
        600: '#16a34a',
        700: '#15803d',
        800: '#166534',
        900: '#14532d',
        950: '#052e16'
    },

    // Error color palette (red)
    red: {
        50: '#fef2f2',
        100: '#fee2e2',
        200: '#fecaca',
        300: '#fca5a5',
        400: '#f87171',
        500: '#ef4444',
        600: '#dc2626',
        700: '#b91c1c',
        800: '#991b1b',
        900: '#7f1d1d',
        950: '#450a0a'
    },

    // Warning/Primary color palette (orange)
    orange: {
        50: '#fff7f2',
        100: '#ffdac2',
        200: '#ffbd91',
        300: '#ffa061',
        400: '#ff8330',
        500: '#ff6600',
        600: '#d95700',
        700: '#b34700',
        800: '#8c3800',
        900: '#662900',
        950: '#401a00'
    },

    // Amber color palette
    amber: {
        50: '#fffbeb',
        100: '#fef3c7',
        200: '#fde68a',
        300: '#fcd34d',
        400: '#fbbf24',
        500: '#f59e0b',
        600: '#d97706',
        700: '#b45309',
        800: '#92400e',
        900: '#78350f',
        950: '#451a03'
    },

    // Yellow color palette
    yellow: {
        50: '#fefce8',
        100: '#fef9c3',
        200: '#fef08a',
        300: '#fde047',
        400: '#facc15',
        500: '#eab308',
        600: '#ca8a04',
        700: '#a16207',
        800: '#854d0e',
        900: '#713f12',
        950: '#422006'
    },

    // Sky/Info color palette
    sky: {
        50: '#f0f9ff',
        100: '#e0f2fe',
        200: '#bae6fd',
        300: '#7dd3fc',
        400: '#38bdf8',
        500: '#0ea5e9',
        600: '#0284c7',
        700: '#0369a1',
        800: '#075985',
        900: '#0c4a6e',
        950: '#082f49'
    },

    // Blue color palette
    blue: {
        50: '#eff6ff',
        100: '#dbeafe',
        200: '#bfdbfe',
        300: '#93c5fd',
        400: '#60a5fa',
        500: '#3b82f6',
        600: '#2563eb',
        700: '#1d4ed8',
        800: '#1e40af',
        900: '#1e3a8a',
        950: '#172554'
    },

    // Purple color palette
    purple: {
        50: '#faf5ff',
        100: '#f3e8ff',
        200: '#e9d5ff',
        300: '#d8b4fe',
        400: '#c084fc',
        500: '#a855f7',
        600: '#9333ea',
        700: '#7e22ce',
        800: '#6b21a8',
        900: '#581c87',
        950: '#3b0764'
    }
} as const;

export type Primitives = typeof primitives;
