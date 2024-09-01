import { relations } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { generateBrandedId } from '../utils';
import { contact } from './contact.schema';
import { emailEvent } from './emailEvent.schema';
import { project } from './project.schema';
import { sender } from './sender.schema';
import { timestamps } from './utils';

export const email = sqliteTable('email', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	publicId: text('public_id')
		.notNull()
		.unique()
		.$default(() => generateBrandedId('eml')),
	contactId: integer('contact_id')
		.references(() => contact.id)
		.notNull(),
	projectId: integer('project_id')
		.references(() => project.id)
		.notNull(),
	senderId: integer('sender_id')
		.references(() => sender.id)
		.notNull(),
	sesMessageId: text('ses_message_id').unique().notNull(),
	...timestamps,
});

export const emailRelations = relations(email, ({ one, many }) => ({
	events: many(emailEvent),
	sender: one(sender, {
		fields: [email.senderId],
		references: [sender.id],
	}),
	contact: one(contact, {
		fields: [email.contactId],
		references: [contact.id],
	}),
	project: one(project, {
		fields: [email.projectId],
		references: [project.id],
	}),
}));
