import { relations } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { apiKeys } from './apiKey.schema.js';
import { emailVerificationCodes } from './emailVerifictationCode.schema.js';
import { sessions } from './session.schema.js';
import { timestamps } from './utils.js';

export const users = sqliteTable('users', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	email: text('email').unique().notNull(),
	emailVerified: integer('email_verified', { mode: 'boolean' }).notNull().default(false),
	...timestamps,
});

export const usersRelations = relations(users, ({ many }) => ({
	sessions: many(sessions),
	apiKeys: many(apiKeys),
	emailVerificationCodes: many(emailVerificationCodes),
}));
