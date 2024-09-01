import { getDb } from '@mailer/db';
import { z } from 'zod';
import { snsEventHandler } from '../../utils/handler/sns';

const baseSchema = z.object({
	mail: z.object({
		timestamp: z.string(),
		messageId: z.string(),
		source: z.string(),
		sourceArn: z.string(),
		sendingAccountId: z.string(),
		destination: z.array(z.string()),
		headersTruncated: z.boolean(),
		headers: z.array(
			z.object({
				name: z.string(),
				value: z.string(),
			})
		),
		commonHeaders: z.object({
			from: z.array(z.string()),
			to: z.array(z.string()),
			messageId: z.string(),
			subject: z.string(),
		}),
		tags: z.record(z.array(z.string())),
	}),
});

const bounceSchema = baseSchema.merge(
	z.object({
		eventType: z.literal('Bounce'),
		bounce: z.object({}),
	})
);

const complaintSchema = baseSchema.merge(
	z.object({
		eventType: z.literal('Complaint'),
		complaint: z.object({}),
	})
);

const deliverySchema = baseSchema.merge(
	z.object({
		eventType: z.literal('Delivery'),
		delivery: z.object({}),
	})
);

const sendeSchema = baseSchema.merge(
	z.object({
		eventType: z.literal('Send'),
		send: z.object({}),
	})
);

const rejectSchema = baseSchema.merge(
	z.object({
		eventType: z.literal('Reject'),
		reject: z.object({}),
	})
);

const openSchema = baseSchema.merge(
	z.object({
		eventType: z.literal('Open'),
		open: z.object({}),
	})
);

const clickSchema = baseSchema.merge(
	z.object({
		eventType: z.literal('Click'),
		click: z.object({}),
	})
);

const failureSchema = baseSchema.merge(
	z.object({
		eventType: z.literal('Rendering Failure'),
		failure: z.object({}),
	})
);

const deliveryDelaySchema = baseSchema.merge(
	z.object({
		eventType: z.literal('DeliveryDelay'),
		deliveryDelay: z.object({}),
	})
);

const subscriptionSchema = baseSchema.merge(
	z.object({
		eventType: z.literal('Subscription'),
		subscription: z.object({}),
	})
);

const messageSchema = z.discriminatedUnion('eventType', [
	bounceSchema,
	complaintSchema,
	deliverySchema,
	sendeSchema,
	rejectSchema,
	openSchema,
	clickSchema,
	failureSchema,
	deliveryDelaySchema,
	subscriptionSchema,
]);

export default snsEventHandler({ messageSchema }, async (event, message) => {
	console.log({ message });

	const db = getDb(event.context.env.DB);
	const email = await db.email.query.findFirst({
		where: (table, { eq }) => eq(table.sesMessageId, message.mail.messageId),
	});

	if (!email) throw new Error('Email not found');

	await db.emailEvent.insert({
		emailId: email.id,
		type: message.eventType,
	});

	return new Response('OK');
});
