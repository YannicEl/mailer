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
		where: (table, { eq, and }) => {
			return and(eq(table.projectId, project.id), eq(table.publicId, domain_id));
		},
	});

	if (!domain) throw new Error('Domain not found');

	await ses.identities.delete({
		email_identity: domain.name,
	});

	await db.dnsRecord.delete((table, { eq }) => eq(table.domainId, domain.id));

	await db.domain.delete((table, { eq, and }) => and(eq(table.id, domain.id)));

	return new Response(null, { status: 204 });
});
