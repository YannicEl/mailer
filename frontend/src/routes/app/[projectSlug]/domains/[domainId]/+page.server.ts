import { getProjectAndUser } from '$lib/server/db';
import { ERRORS } from '$lib/server/errors.js';
import { mailer } from '$lib/server/mailer';
import { error, fail, redirect } from '@sveltejs/kit';

export const load = async ({ parent, params, locals: { db } }) => {
	const { project } = await parent();

	const domain = await db.domain.query.findFirst({
		with: {
			dnsRecords: true,
		},
		where: (table, { and, eq }) =>
			and(eq(table.projectId, project.id), eq(table.publicId, params.domainId)),
	});

	if (!domain) error(404, 'Domain not found');

	const domainMapped = {
		id: domain.publicId,
		name: domain.name,
		status: domain.status,
		dnsRecords: domain.dnsRecords.map((record) => ({
			type: record.type,
			name: record.name,
			value: record.value,
		})),
		createdAt: domain.createdAt,
	};

	return {
		domain: domainMapped,
	};
};

export const actions = {
	verify: async ({ params, locals: { db } }) => {
		const { project } = await getProjectAndUser();
		const domain = await db.domain.query.findFirst({
			where: (table, { and, eq }) =>
				and(eq(table.projectId, project.id), eq(table.publicId, params.domainId)),
		});

		if (!domain) return fail(404, ERRORS.UNKNOWN_ERROR);

		const { status } = await mailer.domains.get({ domain_id: domain.publicId });

		await db.domain.update({ status }, (table, { eq }) => eq(table.id, domain.id));
	},
	remove: async ({ params, locals: { db } }) => {
		const { project } = await getProjectAndUser();
		const domain = await db.domain.query.findFirst({
			where: (table, { and, eq }) =>
				and(eq(table.projectId, project.id), eq(table.publicId, params.domainId)),
		});

		if (!domain) return fail(404, ERRORS.UNKNOWN_ERROR);

		await mailer.domains.delete({ domain_id: domain.publicId });

		redirect(302, `/app/${project.slug}/domains`);
	},
};
