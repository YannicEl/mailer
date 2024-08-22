import { relations } from 'drizzle-orm';
import { integer, sqliteTable, text, unique } from 'drizzle-orm/sqlite-core';
import { domain } from './domain.schema';
import { timestamps } from './utils';

export const domainDkimToken = sqliteTable(
	'domain_dkim_token',
	{
		id: integer('id').primaryKey({ autoIncrement: true }),
		domainId: integer('domain_id')
			.references(() => domain.id)
			.notNull(),
		value: text('value').unique().notNull(),
		...timestamps,
	},
	(table) => ({
		unq: unique().on(table.domainId, table.value),
	})
);

export const domainDkimTokenRelations = relations(domainDkimToken, ({ one }) => ({
	domain: one(domain, {
		fields: [domainDkimToken.domainId],
		references: [domain.id],
	}),
}));
