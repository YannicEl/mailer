export const load = async ({ locals: { db } }) => {
	const users = await db.query.user.findMany();

	return {
		users,
	};
};
