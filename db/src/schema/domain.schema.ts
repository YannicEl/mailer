import { relations } from 'drizzle-orm';
import { integer, sqliteTable, text, unique } from 'drizzle-orm/sqlite-core';
import { generateBrandedId } from '../utils';
import { dnsRecord } from './dnsRecord.schema';
import { project } from './project.schema';
import { sender } from './sender.schema';
import { timestamps } from './utils';

export const domain = sqliteTable(
	'domain',
	{
		id: integer('id').primaryKey({ autoIncrement: true }),
		publicId: text('public_id')
			.notNull()
			.unique()
			.$default(() => generateBrandedId('dom')),
		projectId: integer('project_id')
			.references(() => project.id)
			.notNull(),
		name: text('name').unique().notNull(),
		status: text('status', {
			enum: ['PENDING', 'SUCCESS', 'FAILED', 'TEMPORARY_FAILURE', 'NOT_STARTED'],
		}).notNull(),
		...timestamps,
	},
	(table) => ({
		unq: unique().on(table.projectId, table.name),
	})
);

export const domainRelations = relations(domain, ({ one, many }) => ({
	project: one(project, {
		fields: [domain.projectId],
		references: [project.id],
	}),
	senders: many(sender),
	dnsRecords: many(dnsRecord),
}));
