import { context, useEvent } from '$lib/server/context';
import type { DB } from '@mailer/db';
import { getDb } from '@mailer/db';
import { error } from '@sveltejs/kit';

export function useDb(): DB {
	if (context.db) return context.db;

	const event = useEvent();
	if (!event) error(500, 'event not found');
	if (!event.platform?.env) throw new Error('Cloudflare bindings not found');

	context.db = getDb(event.platform.env.DB);
	return context.db;
}
