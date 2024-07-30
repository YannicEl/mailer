import { text } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const fallback: RequestHandler = async ({ request }) => {
	const res = await request.text();
	console.log(res);

	return text('Hello Wrold!');
};
