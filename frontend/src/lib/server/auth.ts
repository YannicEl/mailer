import { dev } from '$app/environment';
import { useEvent } from '$lib/server/context';
import { DrizzleSQLiteAdapter } from '@lucia-auth/adapter-drizzle';
import type { DrizzleDB } from '@mailer/db';
import { schema } from '@mailer/db';
import type { Cookies } from '@sveltejs/kit';
import type { Cookie, Session, User } from 'lucia';
import { Lucia } from 'lucia';

declare module 'lucia' {
	interface Register {
		Lucia: ReturnType<typeof getLucia>;
		DatabaseUserAttributes: {
			email: string;
			emailVerified: boolean;
		};
	}
}

export function getLucia(db: DrizzleDB) {
	const adapter = new DrizzleSQLiteAdapter(db, schema.session, schema.user);
	const lucia = new Lucia(adapter, {
		sessionCookie: {
			attributes: {
				// set to `true` when using HTTPS
				secure: !dev,
			},
		},
		getUserAttributes: ({ email, emailVerified }) => {
			return {
				email,
				emailVerified,
			};
		},
	});

	return lucia;
}

export function useUser(): User | null {
	const event = useEvent();
	return event.locals.user;
}

export function useSeassion(): Session | null {
	const event = useEvent();
	return event.locals.session;
}

export function setSessionCookie(cookies: Cookies, cookie: Cookie) {
	cookies.set(cookie.name, cookie.value, {
		path: '.',
		...cookie.attributes,
	});
}
