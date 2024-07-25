import type { D1Database } from '@cloudflare/workers-types';
import { drizzle, type DrizzleD1Database } from 'drizzle-orm/d1';
import { apiKeyTable } from './schema/apiKey.schema';
import { sessionTable } from './schema/session.schema';
import { userTable } from './schema/user.schema';

export const schema = {
	apiKey: apiKeyTable,
	session: sessionTable,
	user: userTable,
};

export type DB = DrizzleD1Database<typeof schema>;
export function getDb(D1: D1Database): DB {
	const db = drizzle(D1, { schema });
	return db;
}
