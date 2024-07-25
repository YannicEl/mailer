import { getLucia } from '$lib/server/auth';
import { getDb } from '$lib/server/db';
import type { Handle } from '@sveltejs/kit';
import { error } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	if (!event.platform?.env) error(500, 'Cloudflare bindings not found');

	const { DB } = event.platform.env;
	event.locals.db = getDb(DB);

	const lucia = getLucia(event.locals.db);

	const sessionId = event.cookies.get(lucia.sessionCookieName);
	if (!sessionId) {
		event.locals.user = null;
		event.locals.session = null;
		return resolve(event);
	}

	const { session, user } = await lucia.validateSession(sessionId);
	if (session && session.fresh) {
		const sessionCookie = lucia.createSessionCookie(session.id);
		// sveltekit types deviates from the de-facto standard
		// you can use 'as any' too
		event.cookies.set(sessionCookie.name, sessionCookie.value, {
			path: '.',
			...sessionCookie.attributes,
		});
	}
	if (!session) {
		const sessionCookie = lucia.createBlankSessionCookie();
		event.cookies.set(sessionCookie.name, sessionCookie.value, {
			path: '.',
			...sessionCookie.attributes,
		});
	}
	event.locals.user = user;
	event.locals.session = session;

	return resolve(event);
};
