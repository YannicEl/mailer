import { getLucia, setSessionCookie } from '$lib/server/auth';
import { context } from '$lib/server/context';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	context.event = event;

	const lucia = getLucia(event.locals.db);
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

	return resolve(event);
};
