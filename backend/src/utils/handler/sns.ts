import { defineEventHandler, H3Event } from 'h3-nightly';
import { Certificate } from 'pkijs';
import { Schema, z } from 'zod';
import { base64ToArrayBuffer } from '../base64';
import { stringToArrayBuffer } from '../crypto';
import { validateJsonData } from '../validation';

const baseSchema = z.object({
	MessageId: z.string(),
	TopicArn: z.string(),
	Message: z.string(),
	Timestamp: z.string(),
	SignatureVersion: z.literal('2'),
	Signature: z.string(),
	SigningCertURL: z.string(),
});

type SnsEvent = z.infer<typeof snsEventSchema>;
const snsEventSchema = z.union([
	baseSchema.merge(
		z.object({
			Type: z.literal('SubscriptionConfirmation'),
			SubscribeURL: z.string(),
			Token: z.string(),
		})
	),
	baseSchema.merge(
		z.object({
			Type: z.literal('Notification'),
			UnsubscribeURL: z.string(),
			Subject: z.string().optional(),
		})
	),
]);

type SnsEventHandlerParams<T> = {
	messageSchema: Schema<T>;
};

export function snsEventHandler<T>(
	{ messageSchema }: SnsEventHandlerParams<T>,
	handler: (event: H3Event, message: T) => Promise<Response>
) {
	return defineEventHandler(async (event) => {
		try {
			const body = await validateJsonData(snsEventSchema, event.request);

			const isValid = verifySnsSignature(body);
			if (!isValid) throw new Error('Invalid signature');

			const { AWS_SNS_TOPIC_ARN } = event.context.env as Env;
			if (body.TopicArn !== AWS_SNS_TOPIC_ARN) throw new Error('Invalid topic');

			if (body.Type === 'SubscriptionConfirmation') {
				const res = await fetch(body.SubscribeURL);
				if (!res.ok) throw new Error('Failed to confirm subscription');
				console.log('Subscription confirmed');
				return new Response('OK');
			} else {
				const message = messageSchema.parse(JSON.parse(body.Message));
				return handler(event, message);
			}
		} catch (error) {
			console.error(error);
			return new Response('Internal Server Error', { status: 500 });
		}
	});
}

async function verifySnsSignature(snsEvent: SnsEvent): Promise<boolean> {
	const publicKey = await fetchPublicKey(snsEvent.SigningCertURL);

	const keys = ['Message', 'MessageId', 'Timestamp', 'TopicArn', 'Type'];
	if (snsEvent.Type === 'Notification' && snsEvent.Subject) keys.push('Subject');
	if (snsEvent.Type === 'SubscriptionConfirmation') {
		keys.push('SubscribeURL', 'Token');
	}

	let stringToSign = '';
	keys.sort().forEach((key) => {
		stringToSign += `${key}\n${snsEvent[key]}\n`;
	});

	const signature = base64ToArrayBuffer(snsEvent.Signature);
	const data = stringToArrayBuffer(stringToSign);
	const isValid = await crypto.subtle.verify(
		{ name: publicKey.algorithm.name, hash: 'SHA-256' },
		publicKey,
		signature,
		data
	);

	return isValid;
}

async function fetchPublicKey(url: string): Promise<CryptoKey> {
	const pemCertificate = await fetch(url).then((res) => res.text());

	const base64Certificate = pemCertificate
		.replace('-----BEGIN CERTIFICATE-----', '')
		.replace('-----END CERTIFICATE-----', '')
		.replace(/\n/g, '');

	const buffer = base64ToArrayBuffer(base64Certificate);
	const certificate = Certificate.fromBER(buffer);
	return certificate.getPublicKey();
}
