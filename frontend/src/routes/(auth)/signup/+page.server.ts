import { PRIVATE_MAILER_API_KEY } from '$env/static/private';
import { PUBLIC_BACKEND_URL } from '$env/static/public';
import { setSessionCookie } from '$lib/server/auth';
import { validateFormData } from '$lib/server/validation';
import { defineMailerClient } from '@mailer/lib';
import { redirect } from '@sveltejs/kit';
import { generateIdFromEntropySize } from 'lucia';
import { createDate, TimeSpan } from 'oslo';
import { alphabet, generateRandomString } from 'oslo/crypto';
import { z } from 'zod';

const schema = z.object({
	email: z.string().email(),
});

export const actions = {
	default: async ({ request, cookies, locals: { lucia, db } }) => {
		const data = await validateFormData(schema, request);

		const project = await db.project.insert({});

		const user = await db.user.insert({
			id: generateIdFromEntropySize(16),
			projectId: project.id,
			email: data.email,
		});

		await db.projectsToUsers.insert({
			projectId: project.id,
			userId: user.id,
		});

		await db.emailVerificationCode.delete((table, { eq }) => eq(table.userId, user.id));

		const verifictationCode = generateRandomString(8, alphabet('0-9'));
		console.log({ verifictationCode });
		await db.emailVerificationCode.insert({
			userId: user.id,
			code: verifictationCode,
			email: user.email,
			expiresAt: createDate(new TimeSpan(15, 'm')),
		});

		const mailer = defineMailerClient({
			apiKey: PRIVATE_MAILER_API_KEY,
			baseUrl: PUBLIC_BACKEND_URL,
		});

		await mailer.emails.send({
			to: user.email,
			from: 'me@yannic.at',
			subject: 'Email Verification Code',
			body: `Your email verification code is: ${verifictationCode}`,
		});

		const session = await lucia.createSession(user.id, {});

		const sessionCookie = lucia.createSessionCookie(session.id);
		setSessionCookie(cookies, sessionCookie);

		redirect(302, '/verify-email');
	},
};
