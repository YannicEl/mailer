import { sendVerificationCode } from '$lib/server/auth';
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
		const { success, data } = await validateFormData(schema, request);
		if (!success) return fail(400, { error: ERRORS.UNKNOWN_ERROR });

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

		const params = new URLSearchParams({ email: data.email });
		redirect(302, `/verify-email?${params.toString()}`);
	},
};
