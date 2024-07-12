import { createH3, defineEventHandler } from 'h3-nightly';

const app = createH3();
app.all(
	'/',
	defineEventHandler((event) => {
		return new Response('Hello H3!');
	})
);

export default {
	async fetch(request, env, ctx): Promise<Response> {
		return app.fetch(request);
	},
} satisfies ExportedHandler<Env>;
