import { defineConfig, devices } from '@playwright/test';
export default defineConfig({
  testDir: 'tests/e2e',
  use: { baseURL: 'http://127.0.0.1:3000', trace: 'retain-on-failure' },
  projects: [{ name: 'mobile-safari', use: { ...devices['iPhone 13'], browserName: 'chromium' } }, { name: 'desktop-chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: { command: 'npm run dev -- --hostname 127.0.0.1', url: 'http://127.0.0.1:3000', reuseExistingServer: !process.env.CI, timeout: 120000 }
});
