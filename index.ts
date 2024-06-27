import { bufferToHex, hmacSha256, sha256 } from './utils';

const region = 'eu-central-1';

const url = new URL('https://email.eu-central-1.amazonaws.com/v2/email/outbound-emails');

const init: RequestInit = {
	method: 'POST',
	headers: {
		'Content-type': 'application/json',
	},
	body: JSON.stringify({
		Content: {
			Simple: {
				Body: {
					Text: {
						Charset: 'UTF-8',
						Data: 'This is an email',
					},
				},
				Subject: {
					Charset: 'UTF-8',
					Data: 'Test email',
				},
			},
		},
		FromEmailAddress: 'me@yannic.at',
		Destination: {
			ToAddresses: ['me@yannic.at'],
		},
	}),
};

const headers = new Headers(init.headers);
headers.set('host', url.host);

const requestDateTime = new Date().toISOString().replace(/[:\-]|\.\d{3}/g, '');
headers.set('X-Amz-Date', requestDateTime);

const canonicalQueryString = [...url.searchParams]
	.map(([key, value]) => ({ key: encodeURI(key), value: encodeURI(value) }))
	.sort((a, b) => a.key.localeCompare(b.key))
	.map(({ key, value }) => `${key}=${value}`)
	.join('&');

const sortedHeaders = [...headers]
	.map(([key, value]) => ({
		key: key.toLowerCase(),
		value: value.trim(),
	}))
	.sort((a, b) => a.key.localeCompare(b.key));

const canonicalHeaders = sortedHeaders
	.map(({ key, value }) => `${key}:${value}`)
	.join('\n');

const signedHeaders = sortedHeaders.map(({ key }) => key).join(';');

const hashedPayload = bufferToHex(await sha256((init.body as string) ?? ''));

let canonicalRequest = '';
canonicalRequest += init.method?.toUpperCase() + '\n';
canonicalRequest += url.pathname + '\n';
canonicalRequest += canonicalQueryString + '\n';
canonicalRequest += canonicalHeaders + '\n' + '\n';
canonicalRequest += signedHeaders + '\n';
canonicalRequest += hashedPayload;

// console.log(canonicalRequest);
const hashedCanonicalRequest = bufferToHex(await sha256(canonicalRequest));

const requestDateTimeYYYYMMDD = requestDateTime.slice(0, 8);
const credentialScope = `${requestDateTimeYYYYMMDD}/${region}/ses/aws4_request`;

let stringToSign = '';
stringToSign += 'AWS4-HMAC-SHA256' + '\n';
stringToSign += requestDateTime + '\n';
stringToSign += credentialScope + '\n';
stringToSign += hashedCanonicalRequest;

// console.log(stringToSign);

const dateKey = await hmacSha256(`AWS4${AWS_SECRET_ACCESS_KEY}`, requestDateTimeYYYYMMDD);

const dateRegionKey = await hmacSha256(dateKey, region);
const dateRegionServiceKey = await hmacSha256(dateRegionKey, 'ses');
const signingKey = await hmacSha256(dateRegionServiceKey, 'aws4_request');
const signature = bufferToHex(await hmacSha256(signingKey, stringToSign));
// console.log(signature);

headers.set(
	'Authorization',
	`AWS4-HMAC-SHA256 Credential=${AWS_ACCESS_KEY_ID}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`
);

init.headers = headers;
console.time();
const res = await fetch(url, init);
const json = await res.json();
console.log(json);
console.timeEnd();
