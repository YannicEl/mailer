import { relations } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { users } from './user.schema.js';
import { timestamps } from './utils.js';

export const sessions = sqliteTable('sessions', {
	id: text('id').notNull().primaryKey(),
	userId: integer('user_id')
		.notNull()
		.references(() => users.id),
	expiresAt: integer('expires_at').notNull(),
	...timestamps,
});

export const sessionsRelations = relations(sessions, ({ one }) => ({
	author: one(users, {
		fields: [sessions.userId],
		references: [users.id],
	}),
}));
