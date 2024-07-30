import { relations } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { user } from './user.schema';
import { timestamps } from './utils';

export const apiKey = sqliteTable('api_key', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	userId: text('user_id')
		.references(() => user.id)
		.notNull(),
	key: text('key').notNull(),
	...timestamps,
});

export const apiKeyRelationRelations = relations(apiKey, ({ one }) => ({
	user: one(user, {
		fields: [apiKey.userId],
		references: [user.id],
	}),
}));
