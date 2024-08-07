import { getDb } from '@mailer/db';
import { addDomainSchema } from '@mailer/lib';
import { customEventHandler } from '../../utils/handler/default';
import { json } from '../../utils/response';
import { getSESClient } from '../../utils/ses';
import { validateJsonData } from '../../utils/validation';

export default customEventHandler({}, async (event, { project }) => {
	const body = await validateJsonData(addDomainSchema.request, event.request);

	const db = getDb(event.context.env.DB);
	const ses = getSESClient(event);

	const identity = await ses.identities.create({
		EmailIdentity: body.name,
	});

	await db.domain.insert({
		projectId: project.id,
		name: body.name,
	});

	return json<typeof addDomainSchema.response>({ name: body.name });
});
