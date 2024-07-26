import { env } from '$env/dynamic/public';
import { validateFormData } from '$lib/server/validation';
import { schema as tables } from '@mailer/db';
import { redirect } from '@sveltejs/kit';
import { createDate, TimeSpan } from 'oslo';
import { alphabet, generateRandomString } from 'oslo/crypto';
import { z } from 'zod';

const schema = z.object({
	email: z.string().email(),
});

export const actions = {
	default: async ({ request, cookies, locals: { db, lucia } }) => {
		const data = await validateFormData(schema, request);

		const [user] = await db
			.insert(tables.user)
			.values({
				email: data.email,
			})
			.returning();

		const verifictationCode = generateRandomString(8, alphabet('0-9'));
		await db.insert(tables.emailVerificationCode).values({
			userId: user.id,
			code: verifictationCode,
			email: user.email,
			expiresAt: createDate(new TimeSpan(15, 'm')),
		});

		await fetch(`${env.PUBLIC_BACKEND_URL}/emails/send`, {
			method: 'POST',
			body: JSON.stringify({
				to: user.email,
				from: 'me@yannic.at',
				subject: 'Email Verification Code',
				body: `Your email verification code is: ${verifictationCode}`,
			}),
		});

		const session = await lucia.createSession(user.id, {});
		const sessionCookie = lucia.createSessionCookie(session.id);

		cookies.set(sessionCookie.name, sessionCookie.value, {
			path: '.',
			...sessionCookie.attributes,
		});

		redirect(302, '/');
	},
};
