import { ERRORS } from '$lib/server/errors';
import { validateFormData } from '$lib/server/validation';
import { fail } from '@sveltejs/kit';
import { z } from 'zod';

export const load = async ({ parent, url, locals: { db } }) => {
	const { project } = await parent();

	const pageSize = Number(url.searchParams.get('pageSize') ?? 10);
	const page = Number(url.searchParams.get('page') ?? 0);

	const apiKeys = await db.domain.query.findMany({
		where: (table, { eq }) => eq(table.projectId, project.id),
		orderBy: (table, { asc }) => [asc(table.id)],
		limit: pageSize,
		offset: pageSize * page,
	});

	const domainsMapped = apiKeys.map(({ publicId, name, createdAt }) => ({
		id: publicId,
		name,
		createdAt,
	}));

	return { domains: domainsMapped };
};

const addSchema = z.object({
	name: z.string().min(1),
});

const removeSchema = z.object({
	apiKeyId: z.string().min(1),
});

export const actions = {
	add: async ({ request }) => {
		const { success, data } = await validateFormData(addSchema, request);
		if (!success) return fail(400, { error: ERRORS.INVALID_FORM });
	},
	remove: async ({ request }) => {
		const { success, data } = await validateFormData(removeSchema, request);
		if (!success) return fail(400, { error: ERRORS.INVALID_FORM });
	},
};
