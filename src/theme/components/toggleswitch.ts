/**
 * Toggleswitch Component Theme
 */
export const toggleswitch = {
    root: {
        // width: '2.5rem',
        // height: '1.5rem',
        width: '2rem',
        height: '1.2rem',
        borderRadius: '30px',
        // gap: '0.25rem',
        gap: '0.2rem',
        shadow: '{form.field.shadow}',
        focusRing: {
            width: '{focus.ring.width}',
            style: '{focus.ring.style}',
            color: '{focus.ring.color}',
            offset: '{focus.ring.offset}',
            shadow: '{focus.ring.shadow}'
        },
        borderWidth: '1px',
        borderColor: 'transparent',
        hoverBorderColor: 'transparent',
        checkedBorderColor: 'transparent',
        checkedHoverBorderColor: 'transparent',
        invalidBorderColor: '{form.field.invalid.border.color}',
        transitionDuration: '{form.field.transition.duration}',
        slideDuration: '0.2s'
    },
    handle: {
        borderRadius: '50%',
        // size: '1rem',
        size: '0.8rem'
    },
    colorScheme: {
        light: {
            root: {
                background: '{surface.300}',
                disabledBackground: '{form.field.disabled.background}',
                hoverBackground: '{surface.400}',
                checkedBackground: '{primary.color}',
                checkedHoverBackground: '{primary.hover.color}'
            },
            handle: {
                background: '{surface.0}',
                disabledBackground: '{form.field.disabled.color}',
                hoverBackground: '{surface.0}',
                checkedBackground: '{surface.0}',
                checkedHoverBackground: '{surface.0}',
                color: '{text.muted.color}',
                hoverColor: '{text.color}',
                checkedColor: '{primary.color}',
                checkedHoverColor: '{primary.hover.color}'
            }
        }
    }
};
