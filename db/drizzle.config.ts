import { defineConfig } from 'drizzle-kit';

export default defineConfig({
	dialect: 'sqlite',
	driver: process.env.STAGE === 'local' ? undefined : 'd1-http',
	schema: './src/schema/*.schema.ts',
	out: './src/migrations',
	verbose: true,
	strict: true,
	dbCredentials:
		process.env.STAGE === 'local'
			? {
					url: './local-db/v3/d1/miniflare-D1DatabaseObject/711d15caaf91282ce01369d9758d373fd9e9f6641beee11d45dd8c9f9e859ab2.sqlite',
				}
			: {
					accountId: process.env.CLOUDFLARE_ACCOUNT_ID!,
					databaseId: process.env.CLOUDFLARE_D1_ID!,
					token: process.env.CLOUDFLARE_D1_TOKEN!,
				},
});
