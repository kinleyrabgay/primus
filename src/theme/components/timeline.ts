/**
 * Timeline Component Theme
 */
export const timeline = {
    event: {
        minHeight: 'auto'
    },
    horizontal: {
        eventContent: {
            padding: '1rem 0'
        }
    },
    vertical: {
        eventContent: {
            padding: '0 0 1.5rem 1rem'
        }
    },
    eventMarker: {
        size: '0.625rem',
        borderRadius: '50%',
        borderWidth: '2px',
        background: '{content.border.color}',
        borderColor: '{content.border.color}',
        content: {
            borderRadius: '50%',
            size: '0.375rem',
            background: 'transparent'
        }
    },
    eventConnector: {
        color: '{content.border.color}',
        size: '1px'
    }
};
