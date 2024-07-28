import type { RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = ({ fetch }) => {
	return Response.json({ hallo: 'zwallo' });
};
