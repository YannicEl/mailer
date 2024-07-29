import type { DrizzleD1Database } from 'drizzle-orm/d1';
import * as apiKeys from './apiKey.schema';
import * as emailVerificationCodes from './emailVerifictationCode.schema';
import * as sessions from './session.schema';
import * as users from './user.schema';

export type DrizzleDB = DrizzleD1Database<typeof schema>;
export const schema = {
	...users,
	...sessions,
	...emailVerificationCodes,
	...apiKeys,
};
