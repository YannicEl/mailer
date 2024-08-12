import { getProjectAndUser } from '$lib/server/db.js';
import { validateFormData } from '$lib/server/validation.js';
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

	const publicApiKeys = apiKeys.map(({ publicId, name, key, createdAt }) => ({
		id: publicId,
		name,
		key,
		createdAt,
	}));

	return { apiKeys: publicApiKeys };
};

const schema = z.object({
	name: z.string().min(1),
});

export const actions = {
	default: async ({ request, locals: { db } }) => {
		const data = await validateFormData(schema, request);
		const { project } = await getProjectAndUser();

		await db.apiKey.insert({
			projectId: project.id,
			name: data.name,
			key: Math.random().toString(36).substring(2),
		});
	},
};
