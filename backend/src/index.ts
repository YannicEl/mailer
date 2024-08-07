import { createH3 } from 'h3-nightly';
import addDomain from './routes/domains/add';
import deleteDomain from './routes/domains/delete';
import sendEmail from './routes/emails/send';
import receiveEvent from './routes/events/receive';

const app = createH3({ debug: true });

app.post('/domains', addDomain);
app.delete('/domains/:domain_id', deleteDomain);

app.post('/emails/send', sendEmail);

app.all('/events/receive', receiveEvent);

app.all('*', (req) => new Response('Hello World!'));

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
