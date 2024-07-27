export const load = async ({ locals: { db, user } }) => {
	const users = await db.query.user.findMany();

	return {
		user,
		users,
	};
};
