/**
 * Light Theme Specific Semantic Tokens
 */

export const lightTheme = {
    colorScheme: {
        light: {
            surface: {
                0: '#ffffff',
                50: '#f8fafc',
                100: '#f1f5f9',
                200: '#e2e8f0',
                300: '#cbd5e1',
                400: '#94a3b8',
                500: '#64748b',
                600: '#475569',
                700: '#334155',
                800: '#1e293b',
                900: '#0f172a',
                950: '#020617'
            },
            // white: '#ffffff',
            primary: {
                color: '{primary.500}',
                contrastColor: '#ffffff',
                hoverColor: '{primary.600}',
                activeColor: '{primary.700}'
            },
            secondary: {
                color: '{secondary.500}',
                contrastColor: '#ffffff',
                hoverColor: '{secondary.600}',
                activeColor: '{secondary.700}'
            },
            accent: {
                color: '{accent.500}',
                contrastColor: '#ffffff',
                hoverColor: '{accent.600}',
                activeColor: '{accent.700}'
            },
            success: {
                color: '{success.500}',
                contrastColor: '#ffffff',
                hoverColor: '{success.600}',
                activeColor: '{success.700}'
            },
            warning: {
                color: '{warning.500}',
                contrastColor: '#ffffff',
                hoverColor: '{warning.600}',
                activeColor: '{warning.700}'
            },
            error: {
                color: '{error.500}',
                contrastColor: '#ffffff',
                hoverColor: '{error.600}',
                activeColor: '{error.700}'
            },
            yellow: {
                color: '{yellow.500}',
                contrastColor: '#ffffff',
                hoverColor: '{yellow.600}',
                activeColor: '{yellow.700}'
            },
            highlight: {
                background: '{primary.50}',
                focusBackground: '{primary.100}',
                color: '{primary.700}',
                focusColor: '{primary.800}'
            },
            mask: {
                background: 'rgba(0,0,0,0.4)',
                color: '{surface.200}'
            },
            formField: {
                background: '{surface.0}',
                disabledBackground: '{surface.50}',
                filledBackground: '{surface.50}',
                filledHoverBackground: '{surface.50}',
                filledFocusBackground: '{surface.50}',
                borderColor: '{surface.300}',
                hoverBorderColor: '{surface.400}',
                focusBorderColor: '{primary.color}',
                invalidBorderColor: '{red.400}',
                color: '{surface.700}',
                disabledColor: '{surface.500}',
                placeholderColor: '{surface.500}',
                invalidPlaceholderColor: '{red.600}',
                floatLabelColor: '{surface.500}',
                floatLabelFocusColor: '{primary.600}',
                floatLabelActiveColor: '{surface.500}',
                floatLabelInvalidColor: '{form.field.invalid.placeholder.color}',
                iconColor: '{surface.400}',
                shadow: '0 0 #0000, 0 0 #0000, 0 1px 2px 0 rgba(18, 18, 23, 0.05)'
            },
            text: {
                color: '{surface.700}',
                hoverColor: '{surface.800}',
                mutedColor: '{surface.500}',
                hoverMutedColor: '{surface.600}'
            },
            content: {
                background: '{surface.0}',
                hoverBackground: '{surface.100}',
                borderColor: '{surface.200}',
                color: '{text.color}',
                hoverColor: '{text.hover.color}'
            },
            overlay: {
                select: {
                    background: '{surface.0}',
                    borderColor: '{surface.200}',
                    color: '{text.color}',
                    borderRadius: '4px'
                },
                popover: {
                    background: '{surface.0}',
                    borderColor: '{surface.200}',
                    color: '{text.color}'
                },
                modal: {
                    background: '{surface.0}',
                    borderColor: '{surface.200}',
                    color: '{text.color}'
                }
            },
            list: {
                option: {
                    focusBackground: '{primary.50}',
                    selectedBackground: '{primary.50}',
                    selectedFocusBackground: '{primary.50}',
                    color: '{text.color}',
                    focusColor: '{text.hover.color}',
                    selectedColor: '{highlight.color}',
                    selectedFocusColor: '{highlight.focus.color}',
                    icon: {
                        color: '{surface.400}',
                        focusColor: '{surface.500}'
                    }
                },
                optionGroup: {
                    background: 'transparent',
                    color: '{text.muted.color}'
                },
                gap: '4px'
            },
            navigation: {
                item: {
                    focusBackground: '{primary.50}',
                    activeBackground: '{surface.100}',
                    color: '{text.color}',
                    focusColor: '{text.hover.color}',
                    activeColor: '{text.hover.color}',
                    icon: {
                        color: '{surface.400}',
                        focusColor: '{surface.500}',
                        activeColor: '{surface.500}'
                    }
                },
                submenuLabel: {
                    background: 'transparent',
                    color: '{text.muted.color}'
                },
                submenuIcon: {
                    color: '{surface.400}',
                    focusColor: '{surface.500}',
                    activeColor: '{surface.500}'
                }
            }
        }
    }
} as const;
