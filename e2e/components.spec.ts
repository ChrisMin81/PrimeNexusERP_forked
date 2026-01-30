import { expect, Page, test } from '@playwright/test';

type ComponentCase = {
    name: string;
    path: string;
    selectors: string[];
    requiresAuth?: boolean;
    text?: string;
};

test.beforeAll(async ({ browser }) => {
    const page = await browser.newPage();
    await page.goto('/', { waitUntil: 'commit' });
    await page.waitForResponse((response) => response.url().includes('main.js') && response.status() === 200, {
        timeout: 120000
    });
    await page.close();
});

const publicCases: ComponentCase[] = [
    {
        name: 'login',
        path: '/auth/login',
        selectors: [],
        text: 'Welcome to PrimeLand!'
    },
    {
        name: 'unauthorized access',
        path: '/auth/unauthorized-access',
        selectors: [],
        text: 'You do not have the necessary permissions.'
    },
    {
        name: 'error page',
        path: '/auth/error',
        selectors: [],
        text: 'Error Occurred'
    },
    {
        name: 'not found page',
        path: '/notfound',
        selectors: [],
        text: 'Not Found'
    }
];

const authedCases: ComponentCase[] = [
    {
        name: 'layout and dashboard',
        path: '/dashboard',
        selectors: [
            'app-layout',
            'app-topbar',
            'app-sidebar',
            'app-menu',
            '[app-menuitem]',
            'app-footer',
            'app-configurator',
            'app-global-search',
            'app-float-label-input',
            'app-float-label',
            'app-base-input',
            'app-dashboard'
        ],
        requiresAuth: true
    },
    {
        name: 'messages landing page',
        path: '/pages/messages',
        selectors: ['app-test-page'],
        requiresAuth: true
    },
    {
        name: 'inbox page',
        path: '/pages/messages/inbox',
        selectors: [
            'app-inbox',
            'app-mail-toolbar',
            'app-search-input',
            'app-message-table',
            'app-file-downloads-overlay',
            'app-confirm-dialog'
        ],
        requiresAuth: true
    },
    {
        name: 'sent page',
        path: '/pages/messages/sent',
        selectors: ['app-sent', 'app-mail-toolbar', 'app-message-table', 'app-file-downloads-overlay', 'app-confirm-dialog'],
        requiresAuth: true
    },
    {
        name: 'drafts page',
        path: '/pages/messages/drafts',
        selectors: ['app-drafts', 'app-mail-toolbar', 'app-message-table', 'app-file-downloads-overlay'],
        requiresAuth: true
    },
    {
        name: 'compose page',
        path: '/pages/messages/compose',
        selectors: ['app-compose'],
        requiresAuth: true
    },
    {
        name: 'message detail',
        path: '/pages/messages/inbox/23cea578-9673-4f0c-826c-a790d944dd52',
        selectors: ['app-message-detail', 'app-file-list'],
        requiresAuth: true
    },
    {
        name: 'empty page',
        path: '/pages/empty',
        selectors: ['app-empty'],
        requiresAuth: true
    }
];

async function setLoggedIn(page: Page) {
    await page.addInitScript(() => {
        const expiresAt = Date.now() + 60 * 60 * 1000;
        localStorage.setItem('id_token', 'e2e-token');
        localStorage.setItem('expires_at', JSON.stringify(expiresAt));
    });
}

async function clearAuth(page: Page) {
    await page.addInitScript(() => {
        localStorage.clear();
        sessionStorage.clear();
    });
}

async function expectAttached(page: Page, selectors: string[], timeout = 10000) {
    for (const selector of selectors) {
        await expect(page.locator(selector).first()).toBeAttached({ timeout });
    }
}

for (const testCase of publicCases) {
    test(`renders ${testCase.name} components`, async ({ page }) => {
        await clearAuth(page);
        await page.goto(testCase.path, { waitUntil: 'commit' });
        await expectAttached(page, ['app-root', ...testCase.selectors], 30000);
        if (testCase.text) {
            await expect(page.getByText(testCase.text, { exact: false })).toBeVisible({ timeout: 30000 });
        }
    });
}

for (const testCase of authedCases) {
    test(`renders ${testCase.name} components`, async ({ page }) => {
        if (testCase.requiresAuth) {
            await setLoggedIn(page);
        } else {
            await clearAuth(page);
        }
        await page.goto(testCase.path, { waitUntil: 'commit' });
        await expectAttached(page, ['app-root', ...testCase.selectors]);
    });
}

test('renders logout components', async ({ page }) => {
    await setLoggedIn(page);
    await page.goto('/auth/logout', { waitUntil: 'commit' });

    await expectAttached(page, ['app-root', 'app-logout', 'app-floating-configurator']);
});

test('shows loading indicator during inbox fetch', async ({ page }) => {
    await setLoggedIn(page);
    await page.goto('/pages/messages/inbox', { waitUntil: 'commit' });

    await expect(page.locator('p-progressspinner').first()).toBeAttached();
});
