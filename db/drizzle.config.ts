import { config } from 'dotenv';
import { defineConfig } from 'drizzle-kit';

let stage: 'local' | 'dev' | 'prod' = 'local';
if (process.argv.includes('--prod')) {
	stage = 'prod';
} else if (process.argv.includes('--dev')) {
	stage = 'dev';
}

const { parsed } = config({
	path: ['.env', `.env.${stage}`],
});

export default defineConfig({
	dialect: 'sqlite',
	driver: stage === 'local' ? undefined : 'd1-http',
	schema: './src/schema/*.schema.ts',
	out: './src/migrations',
	verbose: true,
	strict: true,
	dbCredentials:
		stage === 'local'
			? {
					url: './local-db/v3/d1/miniflare-D1DatabaseObject/711d15caaf91282ce01369d9758d373fd9e9f6641beee11d45dd8c9f9e859ab2.sqlite',
				}
			: {
					accountId: parsed?.CLOUDFLARE_ACCOUNT_ID!,
					databaseId: parsed?.CLOUDFLARE_D1_ID!,
					token: parsed?.CLOUDFLARE_D1_TOKEN!,
				},
});
