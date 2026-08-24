/**
 * Dark Theme Specific Semantic Tokens
 */

export const darkTheme = {
  colorScheme: {
    dark: {
      surface: {
        0: '#0f172a',
        50: '#1e293b',
        100: '#334155',
        200: '#475569',
        300: '#64748b',
        400: '#94a3b8',
        500: '#cbd5e1',
        600: '#e2e8f0',
        700: '#f1f5f9',
        800: '#f8fafc',
        900: '#ffffff',
        950: '#ffffff',
      },
      primary: {
        color: '{primary.400}',
        contrastColor: '#ffffff',
        hoverColor: '{primary.300}',
        activeColor: '{primary.200}',
      },
      secondary: {
        color: '{secondary.400}',
        contrastColor: '#ffffff',
        hoverColor: '{secondary.300}',
        activeColor: '{secondary.200}',
      },
      accent: {
        color: '{accent.400}',
        contrastColor: '#ffffff',
        hoverColor: '{accent.300}',
        activeColor: '{accent.200}',
      },
      success: {
        color: '{success.400}',
        contrastColor: '#ffffff',
        hoverColor: '{success.300}',
        activeColor: '{success.200}',
      },
      warning: {
        color: '{warning.400}',
        contrastColor: '#ffffff',
        hoverColor: '{warning.300}',
        activeColor: '{warning.200}',
      },
      error: {
        color: '{error.400}',
        contrastColor: '#ffffff',
        hoverColor: '{error.300}',
        activeColor: '{error.200}',
      },
      yellow: {
        color: '{yellow.400}',
        contrastColor: '#ffffff',
        hoverColor: '{yellow.300}',
        activeColor: '{yellow.200}',
      },
      highlight: {
        background: '{surface.100}',
        focusBackground: '{surface.200}',
        color: '{primary.300}',
        focusColor: '{primary.200}',
      },
      mask: {
        background: 'rgba(0,0,0,0.6)',
        color: '{surface.200}',
      },
      formField: {
        background: '{surface.50}',
        disabledBackground: '{surface.100}',
        filledBackground: '{surface.100}',
        filledHoverBackground: '{surface.100}',
        filledFocusBackground: '{surface.100}',
        borderColor: '{surface.300}',
        hoverBorderColor: '{surface.400}',
        focusBorderColor: '{primary.color}',
        invalidBorderColor: '{red.400}',
        color: '{surface.700}',
        disabledColor: '{surface.500}',
        placeholderColor: '{surface.500}',
        invalidPlaceholderColor: '{red.400}',
        floatLabelColor: '{surface.500}',
        floatLabelFocusColor: '{primary.400}',
        floatLabelActiveColor: '{surface.500}',
        floatLabelInvalidColor: '{form.field.invalid.placeholder.color}',
        iconColor: '{surface.500}',
        shadow: 'none',
      },
      text: {
        color: '{surface.700}',
        hoverColor: '{surface.800}',
        mutedColor: '{surface.500}',
        hoverMutedColor: '{surface.600}',
      },
      content: {
        background: '{surface.50}',
        hoverBackground: '{surface.100}',
        borderColor: '{surface.200}',
        color: '{text.color}',
        hoverColor: '{text.hover.color}',
      },
      overlay: {
        select: {
          background: '{surface.50}',
          borderColor: '{surface.200}',
          color: '{text.color}',
          borderRadius: '4px',
        },
        popover: {
          background: '{surface.50}',
          borderColor: '{surface.200}',
          color: '{text.color}',
        },
        modal: {
          background: '{surface.50}',
          borderColor: '{surface.200}',
          color: '{text.color}',
        },
      },
      list: {
        option: {
          focusBackground: '{surface.100}',
          selectedBackground: '{surface.100}',
          selectedFocusBackground: '{surface.200}',
          color: '{text.color}',
          focusColor: '{text.hover.color}',
          selectedColor: '{highlight.color}',
          selectedFocusColor: '{highlight.focus.color}',
          icon: {
            color: '{surface.500}',
            focusColor: '{surface.600}',
          },
        },
        optionGroup: {
          background: 'transparent',
          color: '{text.muted.color}',
        },
        gap: '4px',
      },
      navigation: {
        item: {
          focusBackground: '{surface.100}',
          activeBackground: '{surface.100}',
          color: '{text.color}',
          focusColor: '{text.hover.color}',
          activeColor: '{text.hover.color}',
          icon: {
            color: '{surface.500}',
            focusColor: '{surface.600}',
            activeColor: '{surface.600}',
          },
        },
        submenuLabel: {
          background: 'transparent',
          color: '{text.muted.color}',
        },
        submenuIcon: {
          color: '{surface.500}',
          focusColor: '{surface.600}',
          activeColor: '{surface.600}',
        },
      },
    },
  },
} as const;
