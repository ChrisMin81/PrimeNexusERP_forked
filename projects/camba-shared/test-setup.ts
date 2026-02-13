import { getTestBed } from '@angular/core/testing';
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';

// Only initialize if the environment wasn't already set up by the builder
const testBed = getTestBed();
if (!testBed.platform) {
    testBed.initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting());
}
