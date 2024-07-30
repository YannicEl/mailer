import { getDb } from '@mailer/db';
import { defineEventHandler } from 'h3-nightly';

export default defineEventHandler(async (event) => {
	const db = getDb(event.context.env.DB);
	const user = await db.user.query.findMany();
	return Response.json(user);
});
