import { createH3 } from 'h3-nightly';
import addDomain from './routes/domains/add';
import deleteDomain from './routes/domains/delete';
import sendEmail from './routes/emails/send';

const app = createH3({ debug: true });
app.post('/domains', addDomain);
app.delete('/domains', deleteDomain);
app.delete('/email', sendEmail);
app.all('*', (req) => new Response('Not found', { status: 404 }));

export default {
	async fetch(request, env, ctx): Promise<Response> {
		return app.fetch(request, {
			h3: {
				env,
				ctx,
			},
		});
	},
} satisfies ExportedHandler<Env>;
