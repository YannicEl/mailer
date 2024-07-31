import { getDb } from '@mailer/db';
import { z } from 'zod';
import { customEventHandler } from '../../utils/handler';
import { getSESClient } from '../../utils/ses';
import { validateJsonData } from '../../utils/validation';

const schema = z.object({
	to: z.string().email(),
	from: z.string().email(),
	subject: z.string(),
	body: z.string(),
});

export default customEventHandler({}, async (event, { project }) => {
	const body = await validateJsonData(schema, event.request);

	const ses = getSESClient(event);

	const { MessageId: messageId } = await ses.emails.send({
		Destination: {
			ToAddresses: [body.to],
		},
		FromEmailAddress: body.from,
		Content: {
			Simple: {
				Body: {
					Text: {
						Data: body.body,
					},
				},
				Subject: {
					Data: body.subject,
				},
			},
		},
	});

	const db = getDb(event.context.env.DB);

	let contact = await db.contact.query.findFirst({
		where: (table, { eq }) => eq(table.email, body.to),
	});

	if (!contact) {
		contact = await db.contact.insert({ email: body.to, projectId: project.id });
	}

	await db.email.insert({
		projectId: project.id,
		contactId: contact.id,
		messageId,
	});

	return Response.json({ messageId });
});
