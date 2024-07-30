import { getDb } from '@mailer/db';
import { defineEventHandler } from 'h3-nightly';

export const authMiddleware = defineEventHandler(async (event) => {
	const token = event.request.headers.get('Authorization') ?? 'key';
	if (!token) return new Response('Unauthorized', { status: 401 });

	const [_, apiKey] = token.split(' ');
	if (!apiKey) return new Response('Unauthorized', { status: 401 });

	const db = getDb(event.context.env.DB);
	const user = await db.user.query.findFirst({
		with: {
			apiKey: {
				where: (table, { eq }) => eq(table.key, token),
			},
		},
	});

	if (!user || !user.emailVerified) return new Response('Unauthorized', { status: 401 });
});
