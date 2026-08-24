/**
 * Global test setup for the Vitest (jsdom) unit-test builder.
 *
 * jsdom does not implement several browser APIs that PrimeNG-derived components
 * rely on (matchMedia for responsive menus/overlays, ResizeObserver, etc.).
 * Karma ran in a real Chrome where these existed; under jsdom we polyfill them
 * so component code paths that touch them don't throw during tests.
 */

// window.matchMedia — used by menubar, megamenu, tieredmenu, contextmenu, select,
// multiselect, splitbutton, dock, scrolltop and other responsive/overlay components.
if (!window.matchMedia) {
    Object.defineProperty(window, 'matchMedia', {
        writable: true,
        configurable: true,
        value: (query: string): MediaQueryList =>
            ({
                matches: false,
                media: query,
                onchange: null,
                addListener: () => {},
                removeListener: () => {},
                addEventListener: () => {},
                removeEventListener: () => {},
                dispatchEvent: () => false,
            }) as unknown as MediaQueryList,
    });
}

// ResizeObserver — used by scroller, overlay positioning, autocomplete, etc.
if (!('ResizeObserver' in window)) {
    (window as unknown as { ResizeObserver: unknown }).ResizeObserver = class {
        observe() {}
        unobserve() {}
        disconnect() {}
    };
}

// MutationObserver — jsdom has it, but some components/tests expect a spy-able global.
if (!('MutationObserver' in window)) {
    (window as unknown as { MutationObserver: unknown }).MutationObserver = class {
        observe() {}
        disconnect() {}
        takeRecords() {
            return [];
        }
    };
}

// jsdom does not implement layout; these throw "not a function" otherwise.
if (!Element.prototype.scrollIntoView) {
    Element.prototype.scrollIntoView = () => {};
}
if (!Element.prototype.scrollTo) {
    (Element.prototype as unknown as { scrollTo: () => void }).scrollTo = () => {};
}
if (typeof Range !== 'undefined' && !Range.prototype.getBoundingClientRect) {
    Range.prototype.getBoundingClientRect = () => ({ x: 0, y: 0, width: 0, height: 0, top: 0, left: 0, right: 0, bottom: 0, toJSON: () => ({}) }) as DOMRect;
    (Range.prototype as unknown as { getClientRects: () => unknown }).getClientRects = () => ({ length: 0, item: () => null, [Symbol.iterator]: function* () {} });
}
