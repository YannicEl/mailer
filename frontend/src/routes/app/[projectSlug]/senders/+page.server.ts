export const load = async ({ parent, url, locals: { db } }) => {
	const { project } = await parent();

	const pageSize = Number(url.searchParams.get('pageSize') ?? 10);
	const page = Number(url.searchParams.get('page') ?? 0);

	const senders = await db.sender.query.findMany({
		where: (table, { eq }) => eq(table.projectId, project.id),
		orderBy: (table, { asc }) => [asc(table.id)],
		limit: pageSize,
		offset: pageSize * page,
	});

	const sendersMapped = senders.map(({ publicId, name, email, createdAt }) => ({
		id: publicId,
		name,
		email,
		createdAt,
	}));

	return { senders: sendersMapped };
};
