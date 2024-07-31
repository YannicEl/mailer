import { relations } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { emailVerificationCode } from './emailVerifictationCode.schema';
import { project } from './project.schema';
import { projectsToUsers } from './projectsToUsers.schema';
import { session } from './session.schema';
import { timestamps } from './utils';

export const user = sqliteTable('user', {
	id: text('id').primaryKey(),
	projectId: integer('project_id')
		.references(() => project.id)
		.notNull(),
	email: text('email').unique().notNull(),
	emailVerified: integer('email_verified', { mode: 'boolean' }).notNull().default(false),
	...timestamps,
});

export const userRelations = relations(user, ({ many }) => ({
	sessions: many(session),
	emailVerificationCodes: many(emailVerificationCode),
	projects: many(projectsToUsers),
}));
