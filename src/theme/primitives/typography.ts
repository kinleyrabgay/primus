/**
 * Primitive Typography Tokens
 * Uses Figtree font (matches _fonts.scss and old codebase)
 */
export const typography = {
    fontFamily: {
        sans: "'Figtree-Regular', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif",
        serif: "'Georgia', serif",
        mono: "'Fira Code', monospace"
    },
    fontSize: {
        xs: '12px',
        sm: '14px' /* 14px when root is 14px – body/nav text at base size */,
        base: '14px',
        lg: '16px',
        xl: '18px',
        '2xl': '24px',
        '3xl': '32px',
        '4xl': '40px',
        '5xl': '48px'
    },
    fontWeight: {
        light: '300',
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700'
    },
    lineHeight: {
        tight: '1.25',
        normal: '1.5',
        relaxed: '1.75'
    }
} as const;
