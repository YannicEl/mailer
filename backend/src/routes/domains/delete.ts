import { getDb } from '@mailer/db';
import { z } from 'zod';
import { customEventHandler } from '../../utils/handler/default';
import { getSESClient } from '../../utils/ses';
import { validatePathParameters } from '../../utils/validation';

const schema = z.object({
	domain_id: z.string(),
});

export default customEventHandler({}, async (event, { project }) => {
	const { domain_id } = await validatePathParameters(schema, event);

	const db = getDb(event.context.env.DB);
	const ses = getSESClient(event);

	const domain = await db.domain.query.findFirst({
		where: (table, { eq, and }) =>
			and(eq(table.id, Number(domain_id)), eq(table.projectId, project.id)),
	});

	if (!domain) throw new Error('Domain not found');

	await ses.identities.delete({
		email_identity: domain.name,
	});

	await db.domain.delete((table, { eq, and }) =>
		and(eq(table.id, Number(domain_id)), eq(table.projectId, project.id))
	);

	return new Response(null, { status: 204 });
});
