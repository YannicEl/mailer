import { relations } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { domain } from './domain.schema';
import { timestamps } from './utils';

export const dnsRecord = sqliteTable('dns_record', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	domainId: integer('domain_id')
		.references(() => domain.id)
		.notNull(),
	type: text('type').notNull(),
	name: text('name').notNull(),
	value: text('value').notNull(),
	...timestamps,
});

export const dnsRecordRelations = relations(dnsRecord, ({ one }) => ({
	domain: one(domain, {
		fields: [dnsRecord.domainId],
		references: [domain.id],
	}),
}));
