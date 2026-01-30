// Karma configuration for Angular tests running in headless Chrome.
const { join } = require('path');
// Use Puppeteer's bundled Chromium so a system Chrome install isn't required.
const { executablePath } = require('puppeteer');
process.env.CHROME_BIN = executablePath();

module.exports = function (config) {
    config.set({
        basePath: '',
        frameworks: ['jasmine', '@angular-devkit/build-angular'],
        plugins: [
            require('karma-jasmine'),
            require('karma-chrome-launcher'),
            require('karma-jasmine-html-reporter'),
            require('karma-coverage'),
            require('@angular-devkit/build-angular/plugins/karma')
        ],
        client: {
            jasmine: {},
            clearContext: false
        },
        jasmineHtmlReporter: {
            suppressAll: true
        },
        coverageReporter: {
            dir: join(__dirname, './coverage'),
            subdir: '.',
            reporters: [
                { type: 'html' },
                { type: 'text-summary' }
            ]
        },
        reporters: ['progress', 'kjhtml'],
        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,
        autoWatch: true,
        browsers: ['ChromeHeadlessNoSandbox'],
        customLaunchers: {
            ChromeHeadlessNoSandbox: {
                base: 'ChromeHeadless',
                flags: ['--no-sandbox', '--disable-gpu', '--disable-dev-shm-usage', '--disable-setuid-sandbox']
            }
        },
        browserDisconnectTolerance: 5,
        browserDisconnectTimeout: 30000,
        browserNoActivityTimeout: 60000,
        captureTimeout: 120000,
        singleRun: true,
        restartOnFileChange: false
    });
};
