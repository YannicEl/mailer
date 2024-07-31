import { createH3 } from 'h3-nightly';
import addDomain from './routes/domains/add';
import deleteDomain from './routes/domains/delete';
import sendEmail from './routes/emails/send';
import receiveEvent from './routes/events/receive';
import test from './routes/test';

const app = createH3({ debug: true });

app.get('/test', test);
app.get('/domains', addDomain);
app.delete('/domains', deleteDomain);
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
