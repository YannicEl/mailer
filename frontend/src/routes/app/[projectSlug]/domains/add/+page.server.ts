import { ERRORS } from '$lib/server/errors';
import { mailer } from '$lib/server/mailer.js';
import { validateFormData } from '$lib/server/validation';
import { fail, redirect } from '@sveltejs/kit';
import { z } from 'zod';

const schema = z.object({
	name: z.string().min(1),
});

export const actions = {
	default: async ({ request }) => {
		const { success, data } = await validateFormData(schema, request);
		if (!success) return fail(400, { error: ERRORS.INVALID_FORM });

		const domain = await mailer.domains.add({ name: data.name });

		redirect(302, `${domain.id}`);
	},
};
