import { relations } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { generateBrandedId } from '../utils';
import { project } from './project.schema';
import { timestamps } from './utils';

export const apiKey = sqliteTable('api_key', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	publicId: text('public_id')
		.notNull()
		.unique()
		.$default(() => generateBrandedId('key')),
	projectId: integer('project_id')
		.references(() => project.id)
		.notNull(),
	name: text('name').notNull(),
	key: text('key').notNull().unique(),
	...timestamps,
});

export const apiKeyRelations = relations(apiKey, ({ one }) => ({
	project: one(project, {
		fields: [apiKey.projectId],
		references: [project.id],
	}),
}));
