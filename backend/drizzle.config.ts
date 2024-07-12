import { defineConfig } from 'drizzle-kit';

export default defineConfig({
	dialect: 'sqlite',
	schema: './drizzle/schema/*.schema.ts',
	out: './drizzle/migrations',
	verbose: true,
	strict: true,
	dbCredentials: {
		url: './.wrangler/state/v3/d1/miniflare-D1DatabaseObject/0793164f3fd595b5e9dc144561732b42bb3b8c9d3d6d8a57e69f2753f2849d3d.sqlite',
	},
});
