/**
 * Menu Component Theme
 */
export const menu = {
    root: {
        background: '{content.background}',
        borderColor: '{content.border.color}',
        color: '{content.color}',
        borderRadius: '{content.border.radius}',
        shadow: '{overlay.navigation.shadow}',
        transitionDuration: '{transition.duration}'
    },
    list: {
        padding: '0',
        gap: '{navigation.list.gap}'
    },
    item: {
        padding: '10px 16px',
        borderRadius: '0',
        focusBackground: '{orange.50}',
        color: '{navigation.item.color}',
        focusColor: '{navigation.item.focus.color}',
        gap: '{navigation.item.gap}',
        icon: {
            color: '{navigation.item.icon.color}',
            focusColor: '{navigation.item.icon.focus.color}'
        }
    },
    submenuLabel: {
        padding: '{navigation.submenu.label.padding}',
        fontWeight: '{navigation.submenu.label.font.weight}',
        background: '{navigation.submenu.label.background}',
        color: '{navigation.submenu.label.color}'
    },
    separator: {
        borderColor: '{content.border.color}'
    }
};
