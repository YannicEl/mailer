import { relations } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { user } from './user.schema';
import { timestamps } from './utils';

export const emailEvent = sqliteTable('email_event', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	userId: text('user_id')
		.references(() => user.id)
		.notNull(),
	...timestamps,
});

export const apiKeyRelationRelations = relations(emailEvent, ({ one }) => ({
	user: one(user, {
		fields: [emailEvent.userId],
		references: [user.id],
	}),
}));
