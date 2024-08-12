import { sendVerificationCode, setSessionCookie } from '$lib/server/auth';
import { validateFormData } from '$lib/server/validation';
import { error, redirect } from '@sveltejs/kit';
import { z } from 'zod';

const schema = z.object({
	email: z.string().email(),
});

export const actions = {
	default: async ({ request, cookies, locals: { lucia, db } }) => {
		const data = await validateFormData(schema, request);

		const user = await db.user.query.findFirst({
			where: (table, { eq }) => eq(table.email, data.email),
		});

		if (!user) error(400, 'User not found');

		await sendVerificationCode(user);

		const session = await lucia.createSession(user.id, {});

		const sessionCookie = lucia.createSessionCookie(session.id);
		setSessionCookie(cookies, sessionCookie);


		redirect(302, '/verify-email');
	},
};
