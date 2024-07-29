import type { D1Database } from '@cloudflare/workers-types';
import { drizzle, type DrizzleD1Database } from 'drizzle-orm/d1';
import * as apiKeys from './schema/apiKey.schema.js';
import * as emailVerificationCodes from './schema/emailVerifictationCode.schema.js';
import * as sessions from './schema/session.schema.js';
import * as users from './schema/user.schema.js';

export const schema = {
	...users,
	...sessions,
	...emailVerificationCodes,
	...apiKeys,
};

export type DB = DrizzleD1Database<typeof schema>;
export function getDb(D1: D1Database) {
	const db = drizzle(D1, { schema });
	return db;
}
