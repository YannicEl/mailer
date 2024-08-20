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

	const { AWS_SES_CONFIGURATIONSET_NAME } = event.context.env as Env;
	const identity = await ses.identities.create({
		ConfigurationSetName: AWS_SES_CONFIGURATIONSET_NAME,
		EmailIdentity: body.name,
	});

	if (!identity.DkimAttributes.Status) throw new Error('Failed to add domain');

	const domain = await db.domain.insert({
		projectId: project.id,
		name: body.name,
		status: identity.DkimAttributes.Status,
	});

	return json<typeof addDomainSchema.response>({
		id: domain.publicId,
		name: body.name,
		status: domain.status,
	});
});
