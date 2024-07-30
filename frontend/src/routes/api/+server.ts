import { text } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const fallback: RequestHandler = async ({ request }) => {
	const json = await request.json();
	console.log(json);

	return text('Hello Wrold!');
};
