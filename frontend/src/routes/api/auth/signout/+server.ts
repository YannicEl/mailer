import { signOut } from '$lib/server/auth.js';
import { redirect } from '@sveltejs/kit';

export const GET = async ({ locals: { session } }) => {
	signOut(session);

	redirect(302, '/signin');
};
