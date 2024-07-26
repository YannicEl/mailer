import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { timestamps } from './utils';

export const userTable = sqliteTable('user', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	email: text('email').unique().notNull(),
	emailVerified: integer('email_verified', { mode: 'boolean' }).notNull().default(false),
	...timestamps,
});
