import { getProjectAndUser } from '$lib/server/db.js';
import { ERRORS } from '$lib/server/errors';
import { validateFormData } from '$lib/server/validation.js';
import { fail } from '@sveltejs/kit';
import { z } from 'zod';

export const load = async ({ parent, url, locals: { db } }) => {
	const { project } = await parent();

	const pageSize = Number(url.searchParams.get('pageSize') ?? 10);
	const page = Number(url.searchParams.get('page') ?? 0);

	const apiKeys = await db.apiKey.query.findMany({
		where: (table, { eq }) => eq(table.projectId, project.id),
		orderBy: (table, { asc }) => [asc(table.id)],
		limit: pageSize,
		offset: pageSize * page,
	});

	const apiKeysMapped = apiKeys.map(({ publicId, name, key, createdAt }) => ({
		id: publicId,
		name,
		key,
		createdAt,
	}));

	return { apiKeys: apiKeysMapped };
};

const addSchema = z.object({
	name: z.string().min(1),
});

const removeSchema = z.object({
	apiKeyId: z.string().min(1),
});

export const actions = {
	add: async ({ request, locals: { db } }) => {
		const { success, data } = await validateFormData(addSchema, request);
		if (!success) return fail(400, { error: ERRORS.INVALID_FORM });

		const { project } = await getProjectAndUser();

		await db.apiKey.insert({
			projectId: project.id,
			name: data.name,
			key: Math.random().toString(36).substring(2),
		});
	},
	remove: async ({ request, locals: { db } }) => {
		const { success, data } = await validateFormData(removeSchema, request);
		if (!success) return fail(400, { error: ERRORS.INVALID_FORM });

		const { project } = await getProjectAndUser();

		await db.apiKey.delete((table, { eq, and }) =>
			and(eq(table.projectId, project.id), eq(table.publicId, data.apiKeyId))
		);
	},
};
