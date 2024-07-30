import { defineEventHandler } from 'h3-nightly';

export default defineEventHandler(async (event) => {
	const text = await event.request.text();
	console.log(text);

	return new Response('OK');
});
