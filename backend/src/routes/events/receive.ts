import { defineEventHandler } from 'h3-nightly';
import { Certificate } from 'pkijs';
import { z } from 'zod';
import { sha256 } from '../../utils/crypto';

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
	MessageId: '26e98303-2f91-41a1-9144-9a7035873669',
	TopicArn: 'arn:aws:sns:eu-central-1:466136624261:ses',
	Message:
		'You have chosen to subscribe to the topic arn:aws:sns:eu-central-1:466136624261:ses.\nTo confirm the subscription, visit the SubscribeURL included in this message.',
	Timestamp: '2024-08-04T07:47:47.920Z',
	SignatureVersion: '2',
	Signature:
		'cnochdmmxXH9szT3Zje44N0Iyma8u5OdmSIeP5pUloFKJ90OT5YbdyHeO2YESoJyEToFYg8yD2XeW5Hv49Mash7H8+OPqX4ynlI6t1TGSeyELgB0VgbJ1VU+eK6cWkzOMg3ZYIsTxrYBNY3Tw7kbxsepGdSxHyWzmIny3beEA8sHCEtyvxvMFfTmpu0XqFI7G4TkpXG7KNxoREFzEZVOOUx+ZsP8olZssLGAvY2nHF5fwrKT/d4F2Uhk4iuOh0id05JNLm/mMUBce2GpELPNZwWZQ31ohUo383wUMFz6J1TS//3OXoWZdGyo45yb6ciLpIiCyZP2/cGX5Rj5oMBKcA==',
	SigningCertURL:
		'https://sns.eu-central-1.amazonaws.com/SimpleNotificationService-60eadc530605d63b8e62a523676ef735.pem',
	Type: 'SubscriptionConfirmation',
	SubscribeURL:
		'https://sns.eu-central-1.amazonaws.com/?Action=ConfirmSubscription&TopicArn=arn:aws:sns:eu-central-1:466136624261:ses&Token=2336412f37fb687f5d51e6e2425ba1f259d6d70fa30a972e00e6ad2694676e27d4883edbb51f989ded92d58bdc556ec8d3b0bbfbf5ec73bd702e906e704f23213dcffe1dabb63ce2e4b4e2e5dee37c9f068465e993d04350e7680a6220422403637824791391460d4c4f69e475c476c2',
	Token:
		'2336412f37fb687f5d51e6e2425ba1f259d6d70fa30a972e00e6ad2694676e27d4883edbb51f989ded92d58bdc556ec8d3b0bbfbf5ec73bd702e906e704f23213dcffe1dabb63ce2e4b4e2e5dee37c9f068465e993d04350e7680a6220422403637824791391460d4c4f69e475c476c2',
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
	try {
		// const body  = await validateJsonData(schema, event.request);
		const body = await schema.parse(payload);
		console.log({ body });

		const pemCert = await fetchCert(body.SigningCertURL);
		const publicKey = await getPublicKeyFromX509Cert(pemCert);

		const keys = ['Message', 'MessageId', 'Timestamp', 'TopicArn', 'Type'];
		if (body.Type === 'Notification' && body.Subject) keys.push('Subject');
		if (body.Type === 'SubscriptionConfirmation') {
			keys.push('SubscribeURL', 'Token');
		}

		let stringToSign = '';
		keys.sort().forEach((key) => {
			stringToSign += `${key}\n${body[key]}\n`;
		});

		console.log({ stringToSign });

		const calculatedSignature = await sha256(stringToSign);
		console.log({ calculatedSignature });

		const signature = base64ToArrayBuffer(body.Signature);
		console.log({ signature });

		const result = await crypto.subtle.verify(
			{ name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
			publicKey,
			signature,
			calculatedSignature
		);

		console.log({ result });

		// try {
		// 	const res = await fetch(body.SubscribeURL);
		// 	const text = await res.text();
		// 	console.log({ text });
		// } catch (error) {
		// 	console.error(error);
		// }
	} catch (error) {
		console.error(error);
	}

	return new Response('OK');
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
