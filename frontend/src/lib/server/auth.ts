import { dev } from '$app/environment';
import { useEvent } from '$lib/context';
import { DrizzleSQLiteAdapter } from '@lucia-auth/adapter-drizzle';
import type { DrizzleDB } from '@mailer/db';
import { schema } from '@mailer/db';
import type { DBUser } from '@mailer/db/src/schema/user.schema';
import type { Cookies } from '@sveltejs/kit';
import type { Cookie, Session, User } from 'lucia';
import { Lucia, TimeSpan } from 'lucia';
import { createDate } from 'oslo';
import { alphabet, generateRandomString } from 'oslo/crypto';
import { useDb } from './db';
import { mailer } from './mailer';

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

export function useSession(): Session | null {
	const event = useEvent();
	return event.locals.session;
}

export function useLucia(): Lucia {
	const event = useEvent();
	return event.locals.lucia;
}

export function setSessionCookie(cookies: Cookies, cookie: Cookie) {
	cookies.set(cookie.name, cookie.value, {
		path: '.',
		...cookie.attributes,
	});
}

export async function sendVerificationCode(user: DBUser): Promise<void> {
	const db = useDb();

	await db.emailVerificationCode.delete((table, { eq }) => eq(table.userId, user.id));

	const verifictationCode = generateRandomString(8, alphabet('0-9'));
	await db.emailVerificationCode.insert({
		userId: user.id,
		code: verifictationCode,
		email: user.email,
		expiresAt: createDate(new TimeSpan(15, 'm')),
	});

	await mailer.emails.send({
		to: user.email,
		from: 'me@yannic.at',
		subject: 'Email Verification Code',
		text: `Your email verification code is: ${verifictationCode}`,
	});
}

export async function signOut(session?: Session | null): Promise<void> {
	if (!session) session = useSession();
	if (session) {
		await useLucia().invalidateSession(session.id);
	}
}
