import { relations } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { user } from './user.schema';
import { timestamps } from './utils';

export const emailVerificationCode = sqliteTable('email_verification_code', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	userId: text('user_id')
		.references(() => user.id)
		.notNull(),
	code: text('code').notNull(),
	email: text('email').notNull(),
	expiresAt: integer('expires_at', { mode: 'timestamp_ms' }).notNull(),
	...timestamps,
});

export const emailVerificationCodeRelations = relations(emailVerificationCode, ({ one }) => ({
	user: one(user, {
		fields: [emailVerificationCode.userId],
		references: [user.id],
	}),
}));
