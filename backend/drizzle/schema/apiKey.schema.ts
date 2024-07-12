import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { userTable } from './user.schema';
import { timestamps } from './utils';

export const apiKeyTable = sqliteTable('api_key', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	userId: integer('user_id')
		.notNull()
		.references(() => userTable.id),
	key: text('key').notNull(),
	...timestamps,
});
