import { createVerify } from 'node:crypto';
import { Certificate, CryptoEngine, setEngine } from 'pkijs';

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

async function main() {
	const engine = new CryptoEngine('webcrypto', crypto, crypto.subtle);
	setEngine(engine);

	const pemCert = await fetchCert(payload.SigningCertURL);
	const publicKey = await getPublicKeyFromX509Cert(pemCert);

	const verify = createVerify('SHA256');
	let stringToSign = '';
	const keys = ['Message', 'MessageId', 'SubscribeURL', 'Timestamp', 'Token', 'TopicArn', 'Type'];
	keys.forEach((key) => {
		stringToSign += `${key}\n${payload[key]}\n`;
	});
	verify.write(stringToSign);
	verify.end();

	const signature = base64ToArrayBuffer(payload.Signature);

	// const valid_1 = verify.verify(publicKey, signature);
	// console.log({ valid_1 });

	const calculatedSignature = await sha256(stringToSign);

	const valid_2 = await crypto.subtle.verify(
		{ name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
		publicKey,
		signature,
		calculatedSignature
	);

	console.log({ valid_2 });

	const valid_3 = await engine.verify(
		'RSASSA-PKCS1-v1_5',
		publicKey,
		signature,
		calculatedSignature
	);
	console.log({ valid_3 });
}

main().catch((e) => {
	console.error(e);
	process.exit(1);
});

async function fetchCert(url) {
	const res = await fetch(url);
	const certificate = await res.text();
	return certificate;
}

async function getPublicKeyFromX509Cert(pem) {
	const base64Cert = pem
		.replace('-----BEGIN CERTIFICATE-----', '')
		.replace('-----END CERTIFICATE-----', '')
		.replace(/\n/g, '');

	const buffer = base64ToArrayBuffer(base64Cert);

	const certificate = Certificate.fromBER(buffer);
	return certificate.getPublicKey();
}

function pemCertificateToArrayBuffer(pemCert) {
	const base64Cert = pemCert
		.replace('-----BEGIN CERTIFICATE-----', '')
		.replace('-----END CERTIFICATE-----', '')
		.replace(/\n/g, '');

	return base64ToArrayBuffer(base64Cert);
}

function base64ToArrayBuffer(base64) {
	const binaryString = atob(base64);
	return stringToArrayBuffer(binaryString);
}

function stringToArrayBuffer(string) {
	const bytes = new Uint8Array(string.length);
	for (var i = 0; i < string.length; i++) {
		bytes[i] = string.charCodeAt(i);
	}
	return bytes.buffer;
}

export function sha256(value) {
	const buffer = stringToArrayBuffer(value);
	return crypto.subtle.digest('SHA-256', buffer);
}
