/**
 * Dialog Component Theme
 */
export const dialog = {
  root: {
    background: '{overlay.modal.background}',
    // borderColor: '{primary.500}',
    borderColor: 'none',
    color: '{overlay.modal.color}',
    borderRadius: '8px',
    shadow: '{overlay.modal.shadow}',
  },
  header: {
    // padding: '1rem 1.5rem 0',
    padding: '0.5rem 1.5rem',
    gap: '0.5rem',
    borderBottom: 'black',
  },
  title: {
    // fontSize: '1.25rem',
    // fontWeight: '600',
    fontSize: '1rem',
    fontWeight: '400',
  },
  content: {
    padding: '0 1.5rem 1.5rem 1.5rem',
    // padding: '1.5rem'
  },
  footer: {
    // padding: '0.75rem 1.5rem',
    padding: '0.5rem 1.5rem',
    gap: '0.5rem',
  },
};
