import { getDb } from '@mailer/db';
import { defineEventHandler } from 'h3-nightly';

export default defineEventHandler(async (event) => {
	const db = getDb(event.context.env.DB);
	const users = await db.users.query.findMany();
	return Response.json(users);
});
