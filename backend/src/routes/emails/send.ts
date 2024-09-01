import { getDb } from '@mailer/db';
import { sendEmailSchema } from '@mailer/lib';
import { customEventHandler } from '../../utils/handler/default';
import { json } from '../../utils/response';
import { getSESClient } from '../../utils/ses';
import { validateJsonData } from '../../utils/validation';

export default customEventHandler({}, async (event, { project }) => {
	const body = await validateJsonData(sendEmailSchema.request, event.request);

	const db = getDb(event.context.env.DB);
	const ses = getSESClient(event);

	let sender = await db.sender.query.findFirst({
		where: (table, { and, eq }) => and(eq(table.projectId, project.id), eq(table.email, body.from)),
	});

	if (!sender) {
		const domain = await db.domain.query.findFirst({
			where: (table, { and, eq }) =>
				and(eq(table.projectId, project.id), eq(table.name, body.from.split('@')[1])),
		});

		if (!domain) throw new Error('Domain not found');

		sender = await db.sender.insert({
			projectId: project.id,
			domainId: domain.id,
			email: body.from,
		});
	}

	const bodyType = body.text ? 'Text' : 'Html';
	let emailBody: string;
	if (body.text) {
		emailBody = body.text;
	} else if (body.html) {
		emailBody = body.html;
	} else {
		throw new Error('Either text or html must be provided');
	}

	const { AWS_SES_CONFIGURATIONSET_NAME } = event.context.env as Env;
	const { MessageId: messageId } = await ses.emails.send({
		ConfigurationSetName: AWS_SES_CONFIGURATIONSET_NAME,
		Destination: {
			ToAddresses: [body.to],
		},
		FromEmailAddress: body.from,
		Content: {
			Simple: {
				Body: {
					[bodyType]: {
						Data: emailBody,
					},
				},
				Subject: {
					Data: body.subject,
				},
			},
		},
	});

	let contact = await db.contact.query.findFirst({
		where: (table, { eq }) => eq(table.email, body.to),
	});

	if (!contact) {
		contact = await db.contact.insert({ email: body.to, projectId: project.id });
	}

	const email = await db.email.insert({
		projectId: project.id,
		contactId: contact.id,
		senderId: sender.id,
		sesMessageId: messageId,
	});

	return json<typeof sendEmailSchema.response>({ id: email.publicId });
});
