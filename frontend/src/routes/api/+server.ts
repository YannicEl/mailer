import { text } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const fallback: RequestHandler = async ({ request }) => {
	return text('Hello Wrold!');
};
