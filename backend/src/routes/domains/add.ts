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

	if (!identity.DkimAttributes.Status || !identity.DkimAttributes.Tokens) {
		throw new Error('Failed to add domain');
	}

	const domain = await db.domain.insert({
		projectId: project.id,
		name: body.name,
		status: identity.DkimAttributes.Status,
	});

	const records: { name: string; type: string; value: string }[] = [];
	identity.DkimAttributes.Tokens.forEach((token) => {
		records.push({
			type: 'CNAME',
			name: `${token}._domainkey.${body.name}`,
			value: `${token}.dkim.amazonses.com`,
		});
	});

	await Promise.all(
		records.map((record) => {
			return db.dnsRecord.insert({
				domainId: domain.id,
				name: record.name,
				type: record.type,
				value: record.value,
			});
		})
	);

	return json<typeof addDomainSchema.response>({
		id: domain.publicId,
		name: body.name,
		status: domain.status,
		records,
	});
});
