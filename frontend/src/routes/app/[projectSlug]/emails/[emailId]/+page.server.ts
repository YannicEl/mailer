import { error } from '@sveltejs/kit';

export const load = async ({ parent, params, locals: { db } }) => {
	const { project } = await parent();

	const email = await db.email.query.findFirst({
		with: {
			sender: true,
			contact: true,
			events: true,
		},
		where: (table, { and, eq }) =>
			and(eq(table.projectId, project.id), eq(table.publicId, params.emailId)),
	});

	if (!email) error(404, 'Event not found');

	const emailMapped = {
		id: email.publicId,
		sender: {
			id: email.sender.publicId,
			email: email.sender.email,
		},
		contact: {
			id: email.contact.publicId,
			email: email.contact.email,
		},
		events: email.events.map(({ type, createdAt }) => ({
			type,
			createdAt,
		})),
		createdAt: email.createdAt,
	};
	return {
		email: emailMapped,
	};
};
