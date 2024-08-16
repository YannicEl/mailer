import { sendVerificationCode, setSessionCookie } from '$lib/server/auth';
import { ERRORS } from '$lib/server/errors.js';
import { validateFormData } from '$lib/server/validation';
import { fail, redirect } from '@sveltejs/kit';
import { generateIdFromEntropySize } from 'lucia';
import { z } from 'zod';

const schema = z.object({
	email: z.string().email(),
});

export const actions = {
	default: async ({ request, cookies, locals: { lucia, db } }) => {
		try {
			const { success, data } = await validateFormData(schema, request);
			if (!success) return fail(400, { error: ERRORS.INVALID_EMAIL });

			let user = await db.user.query.findFirst({
				where: (table, { eq }) => eq(table.email, data.email),
			});

			if (!user) {
				const project = await db.project.insert({
					name: 'Personal',
					slug: 'personal',
				});

				user = await db.user.insert({
					id: generateIdFromEntropySize(16),
					email: data.email,
				});

				await db.projectsToUsers.insert({
					projectId: project.id,
					userId: user.id,
				});
			}

			await sendVerificationCode(user);

			const session = await lucia.createSession(user.id, {});

			const sessionCookie = lucia.createSessionCookie(session.id);
			setSessionCookie(cookies, sessionCookie);
		} catch (error) {
			console.error(error);
			return fail(400, { error: ERRORS.UNKNOWN_ERROR });
		}

		redirect(302, '/verify-email');
	},
};
