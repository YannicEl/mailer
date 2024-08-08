import { sendVerificationCode, setSessionCookie } from '$lib/server/auth';
import { validateFormData } from '$lib/server/validation';
import { redirect } from '@sveltejs/kit';
import { generateIdFromEntropySize } from 'lucia';
import { z } from 'zod';

const schema = z.object({
	email: z.string().email(),
});

export const actions = {
	default: async ({ request, cookies, locals: { lucia, db } }) => {
		const data = await validateFormData(schema, request);

		let user = await db.user.query.findFirst({
			where: (table, { eq }) => eq(table.email, data.email),
		});

		if (!user) {
			const project = await db.project.insert({});

			user = await db.user.insert({
				id: generateIdFromEntropySize(16),
				projectId: project.id,
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

		redirect(302, '/verify-email');
	},
};
