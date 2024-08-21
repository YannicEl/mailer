import { error } from '@sveltejs/kit';

export const load = async ({ parent, params, locals: { db } }) => {
	const { project } = await parent();

	const contact = await db.contact.query.findFirst({
		with: {
			emails: {
				with: {
					sender: true,
				},
			},
		},
		where: (table, { and, eq }) =>
			and(eq(table.projectId, project.id), eq(table.publicId, params.contactId)),
	});

	if (!contact) error(404, 'Contact not found');

	const contactMapped = {
		id: contact.publicId,
		email: contact.email,
		createdAt: contact.createdAt,
		emails: contact.emails.map((email) => ({
			id: email.publicId,
			sender: {
				id: email.sender.publicId,
				email: email.sender.email,
			},
			createdAt: email.createdAt,
		})),
	};
	return {
		contact: contactMapped,
	};
};
