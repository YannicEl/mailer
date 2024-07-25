import { sql } from 'drizzle-orm';
import { integer } from 'drizzle-orm/sqlite-core';

export const timestamps = {
	createdAt: integer('created_at', { mode: 'timestamp_ms' })
		.default(sql`CURRENT_TIMESTAMP`)
		.notNull(),
	updatedAt: integer('updated_at', { mode: 'timestamp_ms' })
		.default(sql`CURRENT_TIMESTAMP`)
		.$onUpdate(() => new Date())
		.notNull(),
};
