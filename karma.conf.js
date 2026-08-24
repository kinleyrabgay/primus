// Karma configuration — https://karma-runner.github.io/latest/config/configuration-file.html
// NOTE: Angular 22 still supports the Karma builder. Migrating to the Vitest builder
// (@angular/build:unit-test) additionally requires porting 96 Jasmine spec files to
// Vitest APIs (jasmine.createSpy -> vi.fn, etc.) — tracked as its own phase.
module.exports = function (config) {
    config.set({
        basePath: '',
        frameworks: ['jasmine', '@angular-devkit/build-angular'],
        plugins: [require('karma-jasmine'), require('karma-chrome-launcher'), require('karma-jasmine-html-reporter'), require('karma-coverage'), require('@angular-devkit/build-angular/plugins/karma')],
        client: {
            clearContext: false,
            jasmine: { random: false, stopOnFailure: true }
        },
        coverageReporter: {
            dir: require('path').join(__dirname, './coverage/primus'),
            subdir: '.',
            reporters: [{ type: 'html' }, { type: 'text-summary' }]
        },
        // ChromeHeadlessNoSandbox is for containerised CI (running as root needs --no-sandbox).
        customLaunchers: {
            ChromeHeadlessNoSandbox: {
                base: 'ChromeHeadless',
                flags: ['--no-sandbox', '--disable-gpu', '--disable-dev-shm-usage']
            }
        },
        browserNoActivityTimeout: 120000,
        captureTimeout: 120000,
        reporters: ['progress', 'kjhtml'],
        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,
        browsers: ['ChromeHeadless']
    });
};
