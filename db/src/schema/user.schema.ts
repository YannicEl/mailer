import { relations } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { apiKeys } from './apiKey.schema';
import { emailVerificationCodes } from './emailVerifictationCode.schema';
import { sessions } from './session.schema';
import { timestamps } from './utils';

export const users = sqliteTable('users', {
	id: text('id').primaryKey(),
	email: text('email').unique().notNull(),
	emailVerified: integer('email_verified', { mode: 'boolean' }).notNull().default(false),
	...timestamps,
});

export const usersRelations = relations(users, ({ many }) => ({
	sessions: many(sessions),
	apiKeys: many(apiKeys),
	emailVerificationCodes: many(emailVerificationCodes),
}));
