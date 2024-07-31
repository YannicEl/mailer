import { relations } from 'drizzle-orm';
import { integer, primaryKey, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { project } from './project.schema';
import { user } from './user.schema';
import { timestamps } from './utils';

export const projectsToUsers = sqliteTable(
	'projects_to_users',
	{
		projectId: integer('project_id')
			.references(() => project.id)
			.notNull(),
		userId: text('user_id')
			.references(() => user.id)
			.notNull(),
		...timestamps,
	},
	(table) => ({
		pk: primaryKey({ columns: [table.projectId, table.userId] }),
	})
);

export const projectsToUsersRelations = relations(projectsToUsers, ({ one }) => ({
	project: one(project, {
		fields: [projectsToUsers.projectId],
		references: [project.id],
	}),
	user: one(user, {
		fields: [projectsToUsers.userId],
		references: [user.id],
	}),
}));
