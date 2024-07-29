import { relations } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { users } from './user.schema';
import { timestamps } from './utils';

export const apiKeys = sqliteTable('api_keys', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	userId: text('user_id')
		.references(() => users.id)
		.notNull(),
	key: text('key').notNull(),
	...timestamps,
});

export const apiKeysRelationRelations = relations(apiKeys, ({ one }) => ({
	user: one(users, {
		fields: [apiKeys.userId],
		references: [users.id],
	}),
}));
