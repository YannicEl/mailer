import { env } from '$env/dynamic/public';
import { setSessionCookie } from '$lib/server/auth';
import { useDb } from '$lib/server/db.js';
import { validateFormData } from '$lib/server/validation';
import { redirect } from '@sveltejs/kit';
import { generateIdFromEntropySize } from 'lucia';
import { createDate, TimeSpan } from 'oslo';
import { alphabet, generateRandomString } from 'oslo/crypto';
import { z } from 'zod';

const schema = z.object({
	email: z.string().email(),
});

export const actions = {
	default: async ({ request, cookies, locals: { lucia } }) => {
		const data = await validateFormData(schema, request);

		const db = useDb();

		const user = await db.users.insert({
			id: generateIdFromEntropySize(16),
			email: data.email,
		});

		await db.emailVerificationCodes.delete((table, { eq }) => eq(table.userId, user.id));

		const verifictationCode = generateRandomString(8, alphabet('0-9'));
		await db.emailVerificationCodes.insert({
			userId: user.id,
			code: verifictationCode,
			email: user.email,
			expiresAt: createDate(new TimeSpan(15, 'm')),
		});

		await fetch(`${env.PUBLIC_BACKEND_URL}/emails/send`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer key`,
			},
			body: JSON.stringify({
				to: user.email,
				from: 'me@yannic.at',
				subject: 'Email Verification Code',
				body: `Your email verification code is: ${verifictationCode}`,
			}),
		});

		const session = await lucia.createSession(user.id, {});

		const sessionCookie = lucia.createSessionCookie(session.id);
		setSessionCookie(cookies, sessionCookie);

		redirect(302, '/verify-email');
	},
};
