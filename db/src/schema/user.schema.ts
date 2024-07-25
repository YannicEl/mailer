import { integer, sqliteTable } from 'drizzle-orm/sqlite-core';
import { timestamps } from './utils';

export const userTable = sqliteTable('user', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	...timestamps,
});
