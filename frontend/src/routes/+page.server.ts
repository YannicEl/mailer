export const load = async ({ locals: { db, user } }) => {
	const users = await db.query.users.findMany();

	return {
		user,
		users,
	};
};
