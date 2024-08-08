import { getDb } from '@mailer/db';
import { H3Event } from 'h3-nightly';

export async function validateBearerToken(event: H3Event) {
	const token = event.request.headers.get('Authorization');
	if (!token) return;

	const [_, apiKey] = token.split(' ');
	if (!apiKey) return;

	const db = getDb(event.context.env.DB);
	const project = await db.project.query.findFirst({
		with: {
			apiKeys: {
				where: (table, { eq }) => eq(table.key, apiKey),
			},
		},
	});

	if (!project?.apiKeys?.length) return;
	return project;
}
