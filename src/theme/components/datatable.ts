/**
 * Datatable Component Theme
 */
export const datatable = {
    root: {
        transitionDuration: '{transition.duration}'
    },
    header: {
        background: '{content.background}',
        borderColor: '{datatable.border.color}',
        color: '{content.color}',
        borderWidth: '0 0 1px 0',
        padding: '0.75rem 1rem'
    },
    headerCell: {
        // background: '{surface.100}',
        background: '#F6F8FA',
        // hoverBackground: '{content.hover.background}',
        hoverBackground: '#F6F8FA',
        selectedBackground: 'transparent',
        borderColor: 'transparent',
        hoverColor: 'rgba(0, 0, 0, 0.6)',
        selectedColor: 'rgba(0, 0, 0, 0.6)',
        gap: '0.5rem',
        // padding: '0.75rem 0.625rem',
        padding: '1rem 0.625rem',
        focusRing: {
            width: '{focus.ring.width}',
            style: '{focus.ring.style}',
            color: '{focus.ring.color}',
            offset: '-1px',
            shadow: '{focus.ring.shadow}'
        }
    },
    columnTitle: {
        fontWeight: '600'
    },
    row: {
        background: '{content.background}',
        hoverBackground: '{orange.50}',
        selectedBackground: '{orange.50}',
        color: '{surface.500}',
        hoverColor: '{content.hover.color}',
        selectedColor: '{content.hover.color}',
        focusRing: {
            width: '{focus.ring.width}',
            style: '{focus.ring.style}',
            color: '{focus.ring.color}',
            offset: '-1px',
            shadow: '{focus.ring.shadow}'
        }
    },
    bodyCell: {
        // borderColor: 'transparent',
        borderColor: '{primary.50}',
        padding: '0.625rem 0.625rem'
        // padding: '1rem 0.625rem'
    },
    footerCell: {
        background: '{content.background}',
        borderColor: '{datatable.border.color}',
        color: '{content.color}',
        padding: '0.75rem 1rem'
    },
    columnFooter: {
        fontWeight: '600'
    },
    footer: {
        background: '{content.background}',
        borderColor: '{datatable.border.color}',
        color: '{content.color}',
        borderWidth: '0 0 1px 0',
        padding: '0.75rem 1rem'
    },
    dropPoint: {
        color: '{primary.color}'
    },
    columnResizerWidth: '0.5rem',
    resizeIndicator: {
        width: '1px',
        color: '{primary.color}'
    },
    sortIcon: {
        color: '{text.muted.color}',
        hoverColor: '{text.hover.muted.color}',
        // size: '0.875rem',
        size: '0.7rem'
    },
    loadingIcon: {
        size: '2rem'
    },
    rowToggleButton: {
        hoverBackground: '{content.hover.background}',
        selectedHoverBackground: '{content.background}',
        color: '{text.muted.color}',
        hoverColor: '{text.color}',
        selectedHoverColor: '{primary.color}',
        size: '1.75rem',
        borderRadius: '50%',
        focusRing: {
            width: '{focus.ring.width}',
            style: '{focus.ring.style}',
            color: '{focus.ring.color}',
            offset: '{focus.ring.offset}',
            shadow: '{focus.ring.shadow}'
        }
    },
    filter: {
        inlineGap: '0.5rem',
        overlaySelect: {
            background: '{overlay.select.background}',
            borderColor: '{overlay.select.border.color}',
            borderRadius: '{overlay.select.border.radius}',
            color: '{overlay.select.color}',
            shadow: '{overlay.select.shadow}'
        },
        overlayPopover: {
            background: '{overlay.popover.background}',
            borderColor: '{overlay.popover.border.color}',
            borderRadius: '{overlay.popover.border.radius}',
            color: '{overlay.popover.color}',
            shadow: '{overlay.popover.shadow}',
            padding: '{overlay.popover.padding}',
            gap: '0.5rem'
        },
        rule: {
            borderColor: '{content.border.color}'
        },
        constraintList: {
            padding: '{list.padding}',
            gap: '{list.gap}'
        },
        constraint: {
            focusBackground: '{list.option.focus.background}',
            selectedBackground: '{list.option.selected.background}',
            selectedFocusBackground: '{list.option.selected.focus.background}',
            color: '{list.option.color}',
            focusColor: '{list.option.focus.color}',
            selectedColor: '{list.option.selected.color}',
            selectedFocusColor: '{list.option.selected.focus.color}',
            separator: {
                borderColor: '{content.border.color}'
            },
            padding: '{list.option.padding}',
            borderRadius: '{list.option.border.radius}'
        }
    },
    paginatorTop: {
        borderColor: '{datatable.border.color}',
        borderWidth: '0 0 1px 0'
    },
    paginatorBottom: {
        borderColor: '{datatable.border.color}',
        borderWidth: '0 0 1px 0'
    },
    colorScheme: {
        light: {
            root: {
                borderColor: '{content.border.color}'
            },
            row: {
                stripedBackground: '{surface.50}'
            },
            bodyCell: {
                selectedBorderColor: 'transparent'
            }
        }
    }
};
