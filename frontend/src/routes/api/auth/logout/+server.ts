import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ locals: { session, lucia } }) => {
	if (session) {
		await lucia.invalidateSession(session.id);
	}

	return new Response();
};
