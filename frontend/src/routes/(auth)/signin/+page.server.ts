import { sendVerificationCode } from '$lib/server/auth';
import { ERRORS } from '$lib/server/errors';
import { validateFormData } from '$lib/server/validation';
import { error, fail, redirect } from '@sveltejs/kit';
import { z } from 'zod';

export const load = async ({ locals: { user } }) => {
	if (user?.emailVerified) redirect(302, '/app');
};

const schema = z.object({
	email: z.string().email(),
});

export const actions = {
	default: async ({ request, locals: { db } }) => {
		const { success, data } = await validateFormData(schema, request);
		if (!success) return fail(400, { error: ERRORS.INVALID_EMAIL });

		const user = await db.user.query.findFirst({
			where: (table, { eq }) => eq(table.email, data.email),
		});

		if (!user) error(400, 'User not found');

		await sendVerificationCode(user);

		const params = new URLSearchParams({ email: data.email });
		redirect(302, `/verify-email?${params.toString()}`);
	},
};
