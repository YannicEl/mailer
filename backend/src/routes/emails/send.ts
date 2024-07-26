import { defineEventHandler } from 'h3-nightly';
import { z } from 'zod';
import { getSESClient } from '../../utils/ses';
import { validateJsonData } from '../../utils/validation';

const schema = z.object({
	to: z.string().email(),
	from: z.string().email(),
	subject: z.string(),
	body: z.string(),
});

export default defineEventHandler(async (event) => {
	try {
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

		return Response.json({ messageId });
	} catch (error) {
		console.log(error);
	}
});
