import type { PlaywrightTestConfig } from '@playwright/test';
import { devices } from '@playwright/test';

const config: PlaywrightTestConfig = {
	webServer: {
		command: 'pnpm build && pnpm preview',
		port: 4173,
	},
	testDir: 'tests',
	testMatch: /(.+\.)?(test|spec)\.[jt]s/,

	projects: [
		{
			name: 'Desktop Chrome',
			use: { ...devices['Desktop Chrome'], channel: 'chrome' },
		},
		{
			name: 'Desktop Safari',
			use: devices['Desktop Safari'],
		},
		{
			name: 'Desktop Firefox',
			use: devices['Desktop Firefox'],
		},
		{
			name: 'Mobile Chrome',
			use: devices['Pixel 5'],
		},
		{
			name: 'Mobile Safari',
			use: devices['iPhone SE'],
		},
	],
};

export default config;
