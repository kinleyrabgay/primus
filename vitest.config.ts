import { defineConfig } from 'vitest/config';

/**
 * Runner config for `ng test` (@angular/build:unit-test, Vitest runner).
 *
 * The Angular builder generates the Vite/Angular plugin setup; this file only adds
 * execution policy. Timeouts matter here: a single hanging test (unresolved promise,
 * fake timers never advanced) would otherwise stall the whole 7k-test suite forever
 * instead of failing loudly.
 */
export default defineConfig({
    test: {
        testTimeout: 15_000,
        hookTimeout: 15_000,
        teardownTimeout: 10_000,
        // Isolate spec files across worker processes so one wedged file cannot take the
        // run down with it, and so DOM/global state cannot leak between components.
        // Isolate spec files across worker processes so one wedged file cannot take the
        // run down with it, and so DOM/global state cannot leak between components.
        pool: 'forks',
        isolate: true,
        fileParallelism: true,
        maxConcurrency: 4,
        reporters: ['dot'],
        bail: 0
    }
});
