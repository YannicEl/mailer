import { defineEventHandler } from 'h3-nightly';

export default defineEventHandler((event) => {
	return new Response('domains DELETE');
});
