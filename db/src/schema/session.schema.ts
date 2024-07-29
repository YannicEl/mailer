import { relations } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { users } from './user.schema';
import { timestamps } from './utils';

export const sessions = sqliteTable('sessions', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.references(() => users.id)
		.notNull(),
	expiresAt: integer('expires_at').notNull(),
	...timestamps,
});

export const sessionsRelations = relations(sessions, ({ one }) => ({
	author: one(users, {
		fields: [sessions.userId],
		references: [users.id],
	}),
}));
