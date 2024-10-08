import { context } from '$lib/context';
import { getLucia, setSessionCookie } from '$lib/server/auth';
import { useDb } from '$lib/server/db';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	context.db = useDb(event);
	event.locals.db = context.db;

	const lucia = getLucia(context.db.drizzle);
	event.locals.lucia = lucia;

	const sessionId = event.cookies.get(lucia.sessionCookieName);
	if (!sessionId) {
		event.locals.user = null;
		event.locals.session = null;
		return resolve(event);
	}

	const { session, user } = await lucia.validateSession(sessionId);
	if (session && session.fresh) {
		const sessionCookie = lucia.createSessionCookie(session.id);
		setSessionCookie(event.cookies, sessionCookie);
	}

	if (!session) {
		const sessionCookie = lucia.createBlankSessionCookie();
		setSessionCookie(event.cookies, sessionCookie);
	}

	event.locals.user = user;
	event.locals.session = session;

	context.event = event;

	return resolve(event);
};
