import { defineConfig } from '@playwright/test';

export default defineConfig({
    testDir: './e2e',
    timeout: 60000,
    expect: {
        timeout: 10000
    },
    use: {
        baseURL: 'http://127.0.0.1:4200',
        trace: 'on-first-retry'
    },
    webServer: {
        command: 'npm run start -- --port=4200 --host=127.0.0.1',
        url: 'http://127.0.0.1:4200',
        reuseExistingServer: !process.env.CI,
        timeout: 180000
    }
});
