/**
 * Tag Component Theme
 */
export const tag = {
    root: {
        fontSize: '0.875rem',
        fontWeight: '700',
        padding: '0.25rem 0.5rem',
        gap: '0.25rem',
        borderRadius: '{content.border.radius}',
        roundedBorderRadius: '{border.radius.xl}'
    },
    icon: {
        size: '0.75rem'
    },
    colorScheme: {
        light: {
            primary: {
                background: '{orange.100}',
                color: '{primary.700}'
            },
            secondary: {
                background: '{surface.100}',
                color: '{surface.600}'
            },
            success: {
                background: '{green.100}',
                color: '{green.700}'
            },
            info: {
                background: '{sky.100}',
                color: '{sky.700}'
            },
            warn: {
                background: '{orange.100}',
                color: '{orange.700}'
            },
            danger: {
                background: '{red.100}',
                color: '{red.700}'
            },
            contrast: {
                background: '{surface.950}',
                color: '{surface.0}'
            }
        }
    }
};
