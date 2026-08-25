/**
 * Chip Component Theme
 */
export const chip = {
    root: {
        borderRadius: '16px',
        paddingX: '0.8rem',
        paddingY: '0.4rem',
        gap: '0.5rem',
        transitionDuration: '{transition.duration}'
    },
    image: {
        width: '2rem',
        height: '2rem'
    },
    icon: {
        size: '1rem'
    },
    removeIcon: {
        size: '1rem',
        focusRing: {
            width: '{focus.ring.width}',
            style: '{focus.ring.style}',
            color: '{focus.ring.color}',
            offset: '{focus.ring.offset}',
            shadow: '{form.field.focus.ring.shadow}'
        }
    },
    colorScheme: {
        light: {
            root: {
                background: '{surface.100}',
                color: '{surface.800}'
            },
            icon: {
                color: '{surface.800}'
            },
            removeIcon: {
                color: '{surface.800}'
            }
        }
    }
};
