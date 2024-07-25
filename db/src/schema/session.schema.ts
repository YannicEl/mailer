import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { userTable } from './user.schema';
import { timestamps } from './utils';

export const sessionTable = sqliteTable('session', {
	id: text('id').notNull().primaryKey(),
	userId: integer('user_id')
		.notNull()
		.references(() => userTable.id),
	expiresAt: integer('expires_at').notNull(),
	...timestamps,
});
