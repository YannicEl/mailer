import { relations } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { users } from './user.schema.js';
import { timestamps } from './utils.js';

export const apiKeys = sqliteTable('api_keys', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	userId: integer('user_id')
		.notNull()
		.references(() => users.id),
	key: text('key').notNull(),
	...timestamps,
});

export const apiKeysRelationRelations = relations(apiKeys, ({ one }) => ({
	author: one(users, {
		fields: [apiKeys.userId],
		references: [users.id],
	}),
}));
