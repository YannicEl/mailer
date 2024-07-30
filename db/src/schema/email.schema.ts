import { relations } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { user } from './user.schema';
import { timestamps } from './utils';

export const email = sqliteTable('email', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	userId: text('user_id')
  .references(() => user.id)
  .notNull(),
	messageId: text('message_id').unique().notNull(),
	...timestamps,
});

export const apiKeyRelationRelations = relations(email, ({ one }) => ({
	user: one(user, {
		fields: [email.userId],
		references: [user.id],
	}),
}));
