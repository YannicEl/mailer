import type { DB } from '@mailer/db';
import type { RequestEvent } from '@sveltejs/kit';

export type Context = {
	event: RequestEvent;
	db: DB;
};

export const context: Partial<Context> = {};

export function useEvent(): RequestEvent {
	if (!context.event) throw new Error('event not found');
	return context.event;
}
