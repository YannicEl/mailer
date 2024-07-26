import { validateFormData } from '$lib/server/validation';
import { schema as tables } from '@mailer/db';
import { redirect } from '@sveltejs/kit';
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

		console.log(user);

		const session = await lucia.createSession(user.id, {});
		const sessionCookie = lucia.createSessionCookie(session.id);

		cookies.set(sessionCookie.name, sessionCookie.value, {
			path: '.',
			...sessionCookie.attributes,
		});

		redirect(302, '/');
	},
};
