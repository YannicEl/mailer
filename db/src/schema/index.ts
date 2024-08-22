import type { DrizzleD1Database } from 'drizzle-orm/d1';
import * as apiKey from './apiKey.schema';
import * as contact from './contact.schema';
import * as domain from './domain.schema';
import * as domainDkimToken from './domainDkimToken.schema';
import * as email from './email.schema';
import * as emailEvent from './emailEvent.schema';
import * as emailVerificationCode from './emailVerifictationCode.schema';
import * as project from './project.schema';
import * as projectsToUsers from './projectsToUsers.schema';
import * as sender from './sender.schema';
import * as session from './session.schema';
import * as user from './user.schema';

export type { DBProject } from './project.schema';

export type DrizzleDB = DrizzleD1Database<typeof schema>;

export const schema = {
	...apiKey,
	...contact,
	...domain,
	...domainDkimToken,
	...email,
	...emailEvent,
	...emailVerificationCode,
	...project,
	...projectsToUsers,
	...sender,
	...session,
	...user,
};
