/**
 * Core Semantic Tokens (Theme-agnostic)
 */
export const baseSemantic = {
    transitionDuration: '0.2s',

    focusRing: {
        width: '1px',
        style: 'solid',
        color: '{primary.color}',
        offset: '2px',
        shadow: 'none'
    },

    disabledOpacity: '0.6',
    iconSize: '1rem',
    anchorGutter: '2px',

    // Color scales (mappings to primitives)
    primary: {
        50: '{main.50}',
        100: '{main.100}',
        200: '{main.200}',
        300: '{main.300}',
        400: '{main.400}',
        500: '{main.500}',
        600: '{main.600}',
        700: '{main.700}',
        800: '{main.800}',
        900: '{main.900}'
    },

    secondary: {
        50: '{purple.50}',
        100: '{purple.100}',
        200: '{purple.200}',
        300: '{purple.300}',
        400: '{purple.400}',
        500: '{purple.500}',
        600: '{purple.600}',
        700: '{purple.700}',
        800: '{purple.800}',
        900: '{purple.900}'
    },

    accent: {
        50: '{purple.50}',
        100: '{purple.100}',
        200: '{purple.200}',
        300: '{purple.300}',
        400: '{purple.400}',
        500: '{purple.500}',
        600: '{purple.600}',
        700: '{purple.700}',
        800: '{purple.800}',
        900: '{purple.900}'
    },

    success: {
        50: '{green.50}',
        100: '{green.100}',
        200: '{green.200}',
        300: '{green.300}',
        400: '{green.400}',
        500: '{green.500}',
        600: '{green.600}',
        700: '{green.700}',
        800: '{green.800}',
        900: '{green.900}'
    },

    warning: {
        50: '{orange.50}',
        100: '{orange.100}',
        200: '{orange.200}',
        300: '{orange.300}',
        400: '{orange.400}',
        500: '{orange.500}',
        600: '{orange.600}',
        700: '{orange.700}',
        800: '{orange.800}',
        900: '{orange.900}'
    },

    error: {
        50: '{red.50}',
        100: '{red.100}',
        200: '{red.200}',
        300: '{red.300}',
        400: '{red.400}',
        500: '{red.500}',
        600: '{red.600}',
        700: '{red.700}',
        800: '{red.800}',
        900: '{red.900}'
    },

    yellow: {
        50: '{yellow.50}',
        100: '{yellow.100}',
        200: '{yellow.200}',
        300: '{yellow.300}',
        400: '{yellow.400}',
        500: '{yellow.500}',
        600: '{yellow.600}',
        700: '{yellow.700}',
        800: '{yellow.800}',
        900: '{yellow.900}'
    },

    // Component tokens (theme-agnostic)
    formField: {
        paddingX: '0.75rem',
        paddingY: '0.5rem',
        sm: {
            // fontSize: '0.875rem',
            fontSize: '14px',
            paddingX: '0.625rem',
            paddingY: '0.375rem'
        },
        lg: {
            fontSize: '1.125rem',
            paddingX: '0.875rem',
            paddingY: '0.5rem'
        },
        borderRadius: '{border.radius.md}',
        focusRing: {
            width: '0',
            style: 'none',
            color: 'transparent',
            offset: '0',
            shadow: 'none'
        },
        transitionDuration: '{transition.duration}'
    },

    list: {
        padding: '0.25rem 0.25rem',
        gap: '2px',
        header: {
            padding: '0.5rem 1rem 0.25rem 1rem'
        },
        option: {
            padding: '0.5rem 0.75rem',
            borderRadius: '{border.radius.sm}'
        },
        optionGroup: {
            padding: '0.5rem 0.75rem',
            fontWeight: '600'
        }
    },

    content: {
        borderRadius: '{border.radius.md}'
    },

    mask: {
        transitionDuration: '0.15s'
    },

    navigation: {
        list: {
            padding: '0.25rem 0.25rem',
            gap: '2px'
        },
        item: {
            padding: '0.5rem 0.75rem',
            borderRadius: '{border.radius.sm}',
            gap: '0.5rem'
        },
        submenuLabel: {
            padding: '0.5rem 0.75rem',
            fontWeight: '600'
        },
        submenuIcon: {
            size: '0.875rem'
        }
    },

    overlay: {
        select: {
            borderRadius: '{border.radius.md}',
            shadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)'
        },
        popover: {
            borderRadius: '{border.radius.md}',
            padding: '1.1rem',
            shadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -6px rgba(0, 0, 0, 0.1)'
        },
        modal: {
            borderRadius: '{border.radius.xl}',
            padding: '1.25rem',
            shadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)'
        },
        navigation: {
            shadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)'
        }
    }
} as const;
