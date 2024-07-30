import type { DrizzleD1Database } from 'drizzle-orm/d1';
import * as apiKey from './apiKey.schema';
import * as email from './email.schema';
import * as emailEvent from './emailEvent.schema';
import * as emailVerificationCode from './emailVerifictationCode.schema';
import * as session from './session.schema';
import * as user from './user.schema';

export type DrizzleDB = DrizzleD1Database<typeof schema>;
export const schema = {
	...apiKey,
	...email,
	...emailEvent,
	...emailVerificationCode,
	...session,
	...user,
};
