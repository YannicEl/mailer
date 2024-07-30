import { relations } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { apiKey } from './apiKey.schema';
import { emailVerificationCode } from './emailVerifictationCode.schema';
import { session } from './session.schema';
import { timestamps } from './utils';

export const user = sqliteTable('user', {
	id: text('id').primaryKey(),
	email: text('email').unique().notNull(),
	emailVerified: integer('email_verified', { mode: 'boolean' }).notNull().default(false),
	...timestamps,
});

export const userRelations = relations(user, ({ many }) => ({
	session: many(session),
	apiKey: many(apiKey),
	emailVerificationCode: many(emailVerificationCode),
}));
