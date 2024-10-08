import { relations } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { email } from './email.schema';
import { timestamps } from './utils';

export const emailEvent = sqliteTable('email_event', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	emailId: integer('email_id')
		.references(() => email.id)
		.notNull(),
	...timestamps,
	type: text('event_type').notNull(),
});

export const emailEventRelations = relations(emailEvent, ({ one }) => ({
	email: one(email, {
		fields: [emailEvent.emailId],
		references: [email.id],
	}),
}));
