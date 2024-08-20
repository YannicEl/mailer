import { relations } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { generateBrandedId } from '../utils';
import { domain } from './domain.schema';
import { email } from './email.schema';
import { project } from './project.schema';
import { timestamps } from './utils';

export const sender = sqliteTable('sender', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	publicId: text('public_id')
		.notNull()
		.unique()
		.$default(() => generateBrandedId('snd')),
	projectId: integer('project_id')
		.references(() => project.id)
		.notNull(),
	domainId: integer('domain_id')
		.references(() => domain.id)
		.notNull(),
	name: text('name'),
	email: text('email').notNull(),
	...timestamps,
});

export const senderRelations = relations(sender, ({ one, many }) => ({
	emails: many(email),
	domain: one(domain, {
		fields: [sender.domainId],
		references: [domain.id],
	}),
	project: one(project, {
		fields: [sender.projectId],
		references: [project.id],
	}),
}));
