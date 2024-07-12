import { defineConfig } from 'drizzle-kit';

export default defineConfig({
	dialect: 'sqlite',
	schema: './drizzle/schema/*.schema.ts',
	out: './drizzle/migrations',
	verbose: true,
	strict: true,
	dbCredentials: {
		url: './.wrangler/state/v3/d1/miniflare-D1DatabaseObject/459595b4ac61c3b0406f203582db5ea67f73df925030d4e8bbd4c08baa9a841c.sqlite',
	},
});
