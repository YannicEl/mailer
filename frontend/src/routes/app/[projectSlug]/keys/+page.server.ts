export const load = async ({ parent, locals: { db } }) => {
	const { project } = await parent();

	const apiKeys = await db.apiKey.select((table, { eq }) => eq(table.projectId, project.id));

	return { apiKeys };
};
