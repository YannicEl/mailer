import { error } from '@sveltejs/kit';

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
