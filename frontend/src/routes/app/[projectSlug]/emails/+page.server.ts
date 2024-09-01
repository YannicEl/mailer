export const load = async ({ parent, url, locals: { db } }) => {
	const { project } = await parent();

	const pageSize = Number(url.searchParams.get('pageSize') ?? 10);
	const page = Number(url.searchParams.get('page') ?? 0);

	const emails = await db.email.query.findMany({
		with: {
			sender: true,
			contact: true,
		},
		where: (table, { eq }) => eq(table.projectId, project.id),
		orderBy: (table, { asc }) => [asc(table.id)],
		limit: pageSize,
		offset: pageSize * page,
	});

	const emailsMapped = emails.map(({ publicId, sender, contact, createdAt }) => ({
		id: publicId,
		sender: {
			id: sender.publicId,
			email: sender.email,
		},
		contact: {
			id: contact.publicId,
			email: contact.email,
		},
		createdAt,
	}));

	return { emails: emailsMapped };
};
