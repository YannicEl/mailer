import type { D1Database } from '@cloudflare/workers-types';
import { drizzle, type DrizzleD1Database } from 'drizzle-orm/d1';
import * as apiKeys from './schema/apiKey.schema';
import * as emailVerificationCodes from './schema/emailVerifictationCode.schema';
import * as sessions from './schema/session.schema';
import * as users from './schema/user.schema';

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
