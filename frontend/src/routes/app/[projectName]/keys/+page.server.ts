export const load = async ({ locals: { db, user } }) => {
	const apiKeys = await db.apiKey.select((table, { eq }) => eq(table.projectId, 1));

	return { apiKeys };
};
