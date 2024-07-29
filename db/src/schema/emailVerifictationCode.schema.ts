import { relations } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { users } from './user.schema.js';
import { timestamps } from './utils.js';

export const emailVerificationCodes = sqliteTable('email_verification_codes', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	userId: integer('user_id')
		.notNull()
		.references(() => users.id),
	code: text('code').notNull(),
	email: text('email').notNull(),
	expiresAt: integer('expires_at', { mode: 'timestamp_ms' }).notNull(),
	...timestamps,
});

export const emailVerificationCodesRelations = relations(emailVerificationCodes, ({ one }) => ({
	author: one(users, {
		fields: [emailVerificationCodes.userId],
		references: [users.id],
	}),
}));
