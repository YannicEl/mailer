import { relations } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { email } from './email.schema';
import { project } from './project.schema';
import { timestamps } from './utils';

export const contact = sqliteTable('contact', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	projectId: integer('project_id')
		.references(() => project.id)
		.notNull(),
	email: text('email').unique().notNull(),
	...timestamps,
});

export const contactRelations = relations(contact, ({ one, many }) => ({
	emails: many(email),
	project: one(project, {
		fields: [contact.projectId],
		references: [project.id],
	}),
}));
