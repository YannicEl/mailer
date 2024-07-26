import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { userTable } from './user.schema';
import { timestamps } from './utils';

export const emailVerificationCodeTable = sqliteTable('email_verification_code', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	userId: integer('user_id')
		.notNull()
		.references(() => userTable.id),
	code: text('code').notNull(),
	email: text('email').notNull(),
	expiresAt: integer('expires_at', { mode: 'timestamp_ms' }).notNull(),
	...timestamps,
});
