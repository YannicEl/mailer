import type { D1Database } from '@cloudflare/workers-types';
import { drizzle } from 'drizzle-orm/d1';
import { defineDbClient } from './client';
import { schema } from './schema';

export type { DBProject } from './schema/index';

export type DB = ReturnType<typeof getDb>;
export function getDb(D1: D1Database) {
	const db = drizzle(D1, { schema });
	return defineDbClient({ db, schema });
}

export { schema } from './schema';
export type { DrizzleDB } from './schema';
