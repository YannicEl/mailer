import { getDb } from '@mailer/db';
import { getDomainSchema } from '@mailer/lib';
import { z } from 'zod';
import { customEventHandler } from '../../utils/handler/default';
import { json } from '../../utils/response';
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

	const identity = await ses.identities.get({
		email_identity: domain.name,
	});

	if (!identity.DkimAttributes.Status) throw new Error('Failed to get domain');

	return json<typeof getDomainSchema.response>({
		id: domain.publicId,
		name: domain.name,
		status: identity.DkimAttributes.Status,
	});
});
