import { text } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const fallback: RequestHandler = async ({ request }) => {
	console.log('--------------------------- hi');
	return text('Hello Wrold!');
};
