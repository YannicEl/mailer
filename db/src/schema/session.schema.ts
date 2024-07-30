import { relations } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { user } from './user.schema';
import { timestamps } from './utils';

export const session = sqliteTable('session', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.references(() => user.id)
		.notNull(),
	expiresAt: integer('expires_at').notNull(),
	...timestamps,
});

export const sessionRelations = relations(session, ({ one }) => ({
	user: one(user, {
		fields: [session.userId],
		references: [user.id],
	}),
}));
