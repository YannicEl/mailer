import { relations } from 'drizzle-orm';
import { integer, sqliteTable, text, unique } from 'drizzle-orm/sqlite-core';
import { project } from './project.schema';
import { timestamps } from './utils';

export const domain = sqliteTable(
	'domain',
	{
		id: integer('id').primaryKey({ autoIncrement: true }),
		projectId: integer('project_id')
			.references(() => project.id)
			.notNull(),
		name: text('name').unique().notNull(),
		...timestamps,
	},
	(table) => ({
		unq: unique().on(table.projectId, table.name),
	})
);

export const domainRelations = relations(domain, ({ one }) => ({
	project: one(project, {
		fields: [domain.projectId],
		references: [project.id],
	}),
}));
