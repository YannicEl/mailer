import { getProjectAndUser } from '$lib/server/db';
import { ERRORS } from '$lib/server/errors';
import { mailer } from '$lib/server/mailer.js';
import { validateFormData } from '$lib/server/validation';
import { fail } from '@sveltejs/kit';
import { z } from 'zod';

export const load = async ({ parent, url, locals: { db } }) => {
	const { project } = await parent();

	const pageSize = Number(url.searchParams.get('pageSize') ?? 10);
	const page = Number(url.searchParams.get('page') ?? 0);

	const domains = await db.domain.query.findMany({
		where: (table, { eq }) => eq(table.projectId, project.id),
		orderBy: (table, { asc }) => [asc(table.id)],
		limit: pageSize,
		offset: pageSize * page,
	});

	const domainsMapped = domains.map(({ publicId, name, status, createdAt }) => ({
		id: publicId,
		name,
		status,
		createdAt,
	}));

	return { domains: domainsMapped };
};

const removeSchema = z.object({
	domainId: z.string().min(1),
});

export const actions = {
	remove: async ({ request, locals: { db } }) => {
		const { success, data } = await validateFormData(removeSchema, request);
		if (!success) return fail(400, { error: ERRORS.INVALID_FORM });

		const { project } = await getProjectAndUser();
		const domain = await db.domain.query.findFirst({
			where: (table, { and, eq }) =>
				and(eq(table.projectId, project.id), eq(table.publicId, data.domainId)),
		});

		if (!domain) return fail(404, ERRORS.UNKNOWN_ERROR);

		await mailer.domains.delete({ domain_id: domain.publicId });
	},
};
