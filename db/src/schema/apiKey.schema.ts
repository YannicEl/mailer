import { relations } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { project } from './project.schema';
import { timestamps } from './utils';

export const apiKey = sqliteTable('api_key', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	projectId: integer('project_id')
		.references(() => project.id)
		.notNull(),
	key: text('key').notNull(),
	...timestamps,
});

export const apiKeyRelations = relations(apiKey, ({ one }) => ({
	project: one(project, {
		fields: [apiKey.projectId],
		references: [project.id],
	}),
}));
