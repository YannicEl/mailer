import { defineEventHandler } from 'h3-nightly';
import { Certificate } from 'pkijs';
import { z } from 'zod';

const baseSchema = z.object({
	MessageId: z.string(),
	TopicArn: z.string(),
	Message: z.string(),
	Timestamp: z.string(),
	SignatureVersion: z.literal('2'),
	Signature: z.string(),
	SigningCertURL: z.string(),
});

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

const payload = {
	MessageId: 'b4268362-d21f-4011-ad28-9cc811a3a5ec',
	TopicArn: 'arn:aws:sns:eu-central-1:466136624261:ses',
	Message:
		'You have chosen to subscribe to the topic arn:aws:sns:eu-central-1:466136624261:ses.\nTo confirm the subscription, visit the SubscribeURL included in this message.',
	Timestamp: '2024-08-01T10:35:40.705Z',
	SignatureVersion: '2',
	Signature:
		'qvgb3S6FmQQqYgkusw8o2P6N4miGIM6ykZFZd6ZAk7QD66jEFLPKdvrGM2Br5i28ZSchnUt/EihQQEfDcfzFLqtVfrqiNhQmmJze+v1jKQqDebOd4qCf3Ni8PkbKmwkz81D9m9MdpCEPiISyWPMToDWtyHokA/3YZR9A5wvpnaiQG8M4GmiWR6AEv0cNVBThE/HBrBRooZqKqtrdQiM7jrwH22Gx4qb9jvc8Av8GGmY2tNtFzOMftEq92GnUWpmhduYkghAb08QI2fex2jB3WKLrD3h2ZIomstrmcAMCB9+nR+T7T3kEd6+bSe45wD1oLqlzb40p1t0qJRe51WCd6w==',
	SigningCertURL:
		'https://sns.eu-central-1.amazonaws.com/SimpleNotificationService-60eadc530605d63b8e62a523676ef735.pem',
	Type: 'SubscriptionConfirmation',
	SubscribeURL:
		'https://sns.eu-central-1.amazonaws.com/?Action=ConfirmSubscription&TopicArn=arn:aws:sns:eu-central-1:466136624261:ses&Token=2336412f37fb687f5d51e6e2425ba1f259d6d70a40028a2e169536ec11310e30b957676509b7590f115621a59c91b10d5fa1cf158a32482bdf86ef35f60ffd238537573827f74a8beffddafca481e046dd31f6bd5fad2cd44e01e8bd746651acbf95e3ee8a703d325cc675c8b629bae4',
	Token:
		'2336412f37fb687f5d51e6e2425ba1f259d6d70a40028a2e169536ec11310e30b957676509b7590f115621a59c91b10d5fa1cf158a32482bdf86ef35f60ffd238537573827f74a8beffddafca481e046dd31f6bd5fad2cd44e01e8bd746651acbf95e3ee8a703d325cc675c8b629bae4',
};

const pemCert = `-----BEGIN CERTIFICATE-----
MIIFzzCCBLegAwIBAgIQAp8ooylKMhQDdxA0uvpYWzANBgkqhkiG9w0BAQsFADA8
MQswCQYDVQQGEwJVUzEPMA0GA1UEChMGQW1hem9uMRwwGgYDVQQDExNBbWF6b24g
UlNBIDIwNDggTTAxMB4XDTIzMTIxNDAwMDAwMFoXDTI0MTEyMDIzNTk1OVowHDEa
MBgGA1UEAxMRc25zLmFtYXpvbmF3cy5jb20wggEiMA0GCSqGSIb3DQEBAQUAA4IB
DwAwggEKAoIBAQCudTQAmRaTM3R/bnxIYBtxqkwy29XbkO0cJ9OCeA656uJH+lm+
nqShf13xyx6TdiUk/S4ehinkOxHBKTjSIuHgh+VfPwhqiV9EHxokGUvPCc1PmUl0
XLCU1N+wtf1QZPuBjW0Ja3jLknDcoXrKYGcJGqP35EB36MO8uLhHVqZqoaAoQU6B
tR2PrMB1shIiqUi7uwzAAvPGDgwc9nO9wX5OVQFk8qEcFBCW32O7wOj034CNSRso
ntQ/fxqlZoJdcvC+Z0VgOHEEPQt9yF2XZVJYdLxs0FNUrOsJKpzZCimLEqSfRmCy
EgEv+UteNhD7E4hDRY5dwXE/eyyA5ri3zzEZAgMBAAGjggLrMIIC5zAfBgNVHSME
GDAWgBSBuA5jiokSGOX6OztQlZ/m5ZAThTAdBgNVHQ4EFgQUGOkdg9DPQtVX7owz
puU0BPZ/UZQwHAYDVR0RBBUwE4IRc25zLmFtYXpvbmF3cy5jb20wEwYDVR0gBAww
CjAIBgZngQwBAgEwDgYDVR0PAQH/BAQDAgWgMB0GA1UdJQQWMBQGCCsGAQUFBwMB
BggrBgEFBQcDAjA7BgNVHR8ENDAyMDCgLqAshipodHRwOi8vY3JsLnIybTAxLmFt
YXpvbnRydXN0LmNvbS9yMm0wMS5jcmwwdQYIKwYBBQUHAQEEaTBnMC0GCCsGAQUF
BzABhiFodHRwOi8vb2NzcC5yMm0wMS5hbWF6b250cnVzdC5jb20wNgYIKwYBBQUH
MAKGKmh0dHA6Ly9jcnQucjJtMDEuYW1hem9udHJ1c3QuY29tL3IybTAxLmNlcjAM
BgNVHRMBAf8EAjAAMIIBfwYKKwYBBAHWeQIEAgSCAW8EggFrAWkAdwDuzdBk1dsa
zsVct520zROiModGfLzs3sNRSFlGcR+1mwAAAYxmlLKpAAAEAwBIMEYCIQC7Wfn0
SmVztjM8AstsrNsHeYeW7AETzLAN43x7elB8pwIhAMIwrkbXu/PpNZihBlOPBj04
wS7vZuw42uVjy9yXn4UZAHYASLDja9qmRzQP5WoC+p0w6xxSActW3SyB2bu/qznY
hHMAAAGMZpSyygAABAMARzBFAiEAutVlW1Oax7n5RLBsWXeRmzA/iVKJqcZhjeoZ
4ZzFunECIGKbdbDvZc0Y4moXUopJIXo3p4NwakKczZ9dIWVE/1ZjAHYA2ra/az+1
tiKfm8K7XGvocJFxbLtRhIU0vaQ9MEjX+6sAAAGMZpSyowAABAMARzBFAiAA7R7c
nWrPPHGfRGYER0ketkeD5BGOSUxLZ8zyraYiSAIhAJuZ5TZZj4oNgm4Nkh6xCQkq
Gc39XPPTr8AzCAXxoK5lMA0GCSqGSIb3DQEBCwUAA4IBAQClJ4h/4mZnlkzeP9Dy
aZkSMmWFNNu9W80gwSa/T5oiqYWQz7mjdeIxFnWh/GNsH7UL2zVQqGiUe7/3lwrX
actsL5G/YQuzrqEJnO8/fQFdoQ2jG4iX0LbPFLfUJi3bq5WsMOKO3yjOfFe+jyXF
9E5zcEMB86e2Rn7kxCJQwv0EdbMFCfEzISjUARzWd5swUOTaa/jFkgAYGTLNUOd/
sutMoG10mzPvbLvJUdHFBBfBchxbKmfndtlsKlDh35yVgAVGzItLr0g2VhIU44Nt
SfSFzgCZ4hrvQJTIsaEghvu5ZXFgpRmBRxDGd+7mE56SDJDQUjUkJMMokKmH6yNP
JLla
-----END CERTIFICATE-----`;

export default defineEventHandler(async (event) => {
	// Create new Certificate instance from the BASE64 encoded data
	const key = await getPublicKeyFromX509Cert(pemCert);
	console.log(key);

	return new Response(key.algorithm.name);

	// try {
	// 	// const body = await validateJsonData(schema, event.request);
	// 	const body = await schema.parse(payload);
	// 	// console.log({ body });

	// 	const publicKey = await fetchCert(body.SigningCertURL);

	// 	if (body.Type === 'SubscriptionConfirmation') {
	// 		const stringToSign = [
	// 			'Message',
	// 			body.Message,
	// 			'MessageId',
	// 			body.MessageId,
	// 			'SubscribeURL',
	// 			body.SubscribeURL,
	// 			'Timestamp',
	// 			body.Timestamp,
	// 			'Token',
	// 			body.Token,
	// 			'TopicArn',
	// 			body.TopicArn,
	// 			'Type',
	// 			body.Type,
	// 		].join('\n');

	// 		const calculatedSignature = bufferToHex(await hmacSha256(publicKey, stringToSign));
	// 		console.log({ calculatedSignature });

	// 		const decodedSignature = bufferToHex(base64ToArrayBuffer(body.Signature));
	// 		console.log({ decodedSignature });

	// 		console.log('signature valid');
	// 		console.log(calculatedSignature === decodedSignature);

	// 		let result = await crypto.subtle.verify('RSASSA-PKCS1-v1_5', publicKey, signature, encoded);

	// 		// try {
	// 		// 	const res = await fetch(body.SubscribeURL);
	// 		// 	const text = await res.text();
	// 		// 	console.log({ text });
	// 		// } catch (error) {
	// 		// 	console.error(error);
	// 		// }
	// 	} else {
	// 		const message = await event.request.json();
	// 		console.log(message);
	// 	}

	// 	const text = await event.request.text();
	// 	console.log(text);
	// } catch (error) {
	// 	console.error(error);
	// }

	// return new Response('OK');
});

async function fetchCert(url: string) {
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

function base64ToArrayBuffer(base64: string): ArrayBuffer {
	var binaryString = atob(base64);
	var bytes = new Uint8Array(binaryString.length);
	for (var i = 0; i < binaryString.length; i++) {
		bytes[i] = binaryString.charCodeAt(i);
	}
	return bytes.buffer;
}
