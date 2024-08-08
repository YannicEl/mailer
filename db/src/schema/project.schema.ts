import { relations } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { apiKey } from './apiKey.schema';
import { contact } from './contact.schema';
import { domain } from './domain.schema';
import { email } from './email.schema';
import { projectsToUsers } from './projectsToUsers.schema';
import { timestamps } from './utils';

export type DBProject = typeof project.$inferSelect;

export const project = sqliteTable('project', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	publicId: text('public_id').unique().notNull(),
	name: text('name').notNull(),
	...timestamps,
});

export const projectsRelations = relations(project, ({ many }) => ({
	users: many(projectsToUsers),
	apiKeys: many(apiKey),
	contacts: many(contact),
	emails: many(email),
	domains: many(domain),
}));
