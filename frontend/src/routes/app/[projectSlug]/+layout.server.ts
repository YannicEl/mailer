import { getProjectAndUser } from '$lib/server/db.js';
import { redirect } from '@sveltejs/kit';

export const load = async ({ locals: { user: authUser } }) => {
	if (!authUser) redirect(302, '/signin');

	const { project, user } = await getProjectAndUser();

	return { project, user };
};
