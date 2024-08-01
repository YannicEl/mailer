import { relations } from 'drizzle-orm';
import { integer, sqliteTable } from 'drizzle-orm/sqlite-core';
import { apiKey } from './apiKey.schema';
import { contact } from './contact.schema';
import { domain } from './domain.schema';
import { email } from './email.schema';
import { projectsToUsers } from './projectsToUsers.schema';
import { timestamps } from './utils';

export type DBProject = typeof project.$inferSelect;

export const project = sqliteTable('project', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	...timestamps,
});

export const projectsRelations = relations(project, ({ many }) => ({
	users: many(projectsToUsers),
	apiKeys: many(apiKey),
	contacts: many(contact),
	emails: many(email),
	domains: many(domain),
}));
