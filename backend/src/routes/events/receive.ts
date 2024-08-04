import { defineEventHandler } from 'h3-nightly';
import { Certificate } from 'pkijs';
import { z } from 'zod';
import { base64ToArrayBuffer } from '../../utils/base64';
import { stringToArrayBuffer } from '../../utils/crypto';
import { validateJsonData } from '../../utils/validation';

const baseSchema = z.object({
	MessageId: z.string(),
	TopicArn: z.string(),
	Message: z.string(),
	Timestamp: z.string(),
	SignatureVersion: z.literal('2'),
	Signature: z.string(),
	SigningCertURL: z.string(),
});

type SnsEvent = z.infer<typeof schema>;
const schema = z.union([
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
			Subject: z.string(),
		})
	),
]);

export default defineEventHandler(async (event) => {
	try {
		const body = await validateJsonData(schema, event.request);

		const isValid = verifySNSSignature(body);
		if (!isValid) throw new Error('Invalid signature');

		const { AWS_SNS_TOPIC_ARN } = event.context.env as Env;
		if (body.TopicArn !== AWS_SNS_TOPIC_ARN) throw new Error('Invalid topic');

		if (body.Type === 'SubscriptionConfirmation') {
			// Confirm the subscription
			const res = await fetch(body.SubscribeURL);
			if (!res.ok) throw new Error('Failed to confirm subscription');
			console.log('Subscription confirmed');
		} else {
			const message = JSON.parse(body.Message);
			console.log({ message });
		}
	} catch (error) {
		console.error(error);
	}

	return new Response('OK');
});

async function verifySNSSignature(snsEvent: SnsEvent): Promise<boolean> {
	const pemCert = await fetchCert(snsEvent.SigningCertURL);
	const publicKey = await getPublicKeyFromX509Cert(pemCert);

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

async function fetchCert(url: string): Promise<string> {
	const res = await fetch(url);
	const certificate = await res.text();
	return certificate;
}

async function getPublicKeyFromX509Cert(pem: string): Promise<CryptoKey> {
	const base64Cert = pem
		.replace('-----BEGIN CERTIFICATE-----', '')
		.replace('-----END CERTIFICATE-----', '')
		.replace(/\n/g, '');

	const buffer = base64ToArrayBuffer(base64Cert);
	const certificate = Certificate.fromBER(buffer);
	return certificate.getPublicKey();
}
