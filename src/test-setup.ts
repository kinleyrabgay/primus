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
                dispatchEvent: () => false
            }) as unknown as MediaQueryList
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

// jsdom 28 bug: window.getComputedStyle can throw
//   "Cannot destructure property 'value' of 'Specificity.max(...)' as it is undefined"
// while computing the style cascade for otherwise-ordinary elements. Focus/visibility
// utilities (DomHandler.getFocusableElements, primeuix getFocusableElements) call it —
// sometimes deferred via setTimeout — so an uncaught throw there crashes the whole Vitest
// worker fork ("Worker exited unexpectedly"), not just one test. Wrap it: pass real calls
// through unchanged, and only on the jsdom crash return a safe, visible default.
{
    const nativeGetComputedStyle = window.getComputedStyle.bind(window);
    const safeStyleFallback = () =>
        new Proxy({ display: 'block', visibility: 'visible' } as Record<string, unknown>, {
            get(target, prop) {
                if (prop === 'getPropertyValue') return () => '';

                return prop in target ? target[prop as string] : '';
            }
        }) as unknown as CSSStyleDeclaration;

    Object.defineProperty(window, 'getComputedStyle', {
        writable: true,
        configurable: true,
        value: (element: Element, pseudoElt?: string | null): CSSStyleDeclaration => {
            try {
                return nativeGetComputedStyle(element, pseudoElt ?? undefined);
            } catch {
                return safeStyleFallback();
            }
        }
    });
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
