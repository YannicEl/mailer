import { getProjectAndUser } from '$lib/server/db.js';
import { validateFormData } from '$lib/server/validation.js';
import { z } from 'zod';

export const load = async ({ parent, locals: { db } }) => {
	const { project } = await parent();

	const apiKeys = await db.apiKey.select((table, { eq }) => eq(table.projectId, project.id));

	const publicApiKeys = apiKeys.map(({ name, key, createdAt }) => ({ name, key, createdAt }));

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
