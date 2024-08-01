import { relations } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { project } from './project.schema';
import { timestamps } from './utils';

export const domain = sqliteTable('domain', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	projectId: integer('project_id')
		.references(() => project.id)
		.notNull(),
	domain: text('email').unique().notNull(),
	...timestamps,
});

export const domainRelations = relations(domain, ({ one }) => ({
	project: one(project, {
		fields: [domain.projectId],
		references: [project.id],
	}),
}));
