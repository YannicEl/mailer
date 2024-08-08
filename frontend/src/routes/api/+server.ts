import { text } from '@sveltejs/kit';

export const fallback = async ({ request }) => {
	console.log('--------------------------- hi');
	return text('Hello Wrold!');
};
