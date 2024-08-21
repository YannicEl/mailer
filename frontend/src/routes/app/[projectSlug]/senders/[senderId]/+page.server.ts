import { error } from '@sveltejs/kit';

export const load = async ({ parent, params, locals: { db } }) => {
	const { project } = await parent();

	const sender = await db.sender.query.findFirst({
		with: {
			emails: {
				with: {
					contact: true,
				},
			},
		},
		where: (table, { and, eq }) =>
			and(eq(table.projectId, project.id), eq(table.publicId, params.senderId)),
	});

	if (!sender) error(404, 'Sender not found');

	const senderMapped = {
		id: sender.publicId,
		name: sender.name,
		email: sender.email,
		createdAt: sender.createdAt,
		emails: sender.emails.map((email) => ({
			id: email.publicId,
			contact: {
				id: email.contact.publicId,
				email: email.contact.email,
			},
			createdAt: email.createdAt,
		})),
	};

	return {
		sender: senderMapped,
	};
};
