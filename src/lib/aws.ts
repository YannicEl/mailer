import { bufferToHex, hmacSha256, sha256 } from './utils';

const region = 'eu-central-1';
const basePath = `https://email.${region}.amazonaws.com/v2/emails`;

export async function verifyIdentity(identity: string): Promise<boolean> {
	const res = await signedFetch(`${basePath}/identities`, {
		method: 'POST',
		body: JSON.stringify({
			EmailIdentity: identity,
		}),
	});

	const json = await res.json();
	return json;
}

export async function signedFetch(input: string, init: RequestInit): Promise<Response> {
	const url = new URL(input);
	init.headers = new Headers(init.headers);

	init.headers.set('host', url.host);

	const requestDateTime = new Date().toISOString().replace(/[:\-]|\.\d{3}/g, '');
	init.headers.set('X-Amz-Date', requestDateTime);

	const canonicalQueryString = [...url.searchParams]
		.map(([key, value]) => ({ key: encodeURI(key), value: encodeURI(value) }))
		.sort((a, b) => a.key.localeCompare(b.key))
		.map(({ key, value }) => `${key}=${value}`)
		.join('&');

	const sortedHeaders = [...init.headers]
		.map(([key, value]) => ({
			key: key.toLowerCase(),
			value: value.trim(),
		}))
		.sort((a, b) => a.key.localeCompare(b.key));

	const canonicalHeaders = sortedHeaders.map(({ key, value }) => `${key}:${value}`).join('\n');

	const signedHeaders = sortedHeaders.map(({ key }) => key).join(';');

	const hashedPayload = bufferToHex(await sha256((init.body as string) ?? ''));

	const canonicalRequest = [
		init.method?.toUpperCase(),
		url.pathname,
		canonicalQueryString,
		canonicalHeaders + '\n',
		signedHeaders,
		hashedPayload,
	].join('\n');

	const hashedCanonicalRequest = bufferToHex(await sha256(canonicalRequest));

	const requestDateTimeYYYYMMDD = requestDateTime.slice(0, 8);
	const credentialScope = `${requestDateTimeYYYYMMDD}/${region}/ses/aws4_request`;

	const stringToSign = [
		'AWS4-HMAC-SHA256',
		requestDateTime,
		credentialScope,
		hashedCanonicalRequest,
	].join('\n');

	const dateKey = await hmacSha256(`AWS4${AWS_SECRET_ACCESS_KEY}`, requestDateTimeYYYYMMDD);
	const dateRegionKey = await hmacSha256(dateKey, region);
	const dateRegionServiceKey = await hmacSha256(dateRegionKey, 'ses');
	const signingKey = await hmacSha256(dateRegionServiceKey, 'aws4_request');
	const signature = bufferToHex(await hmacSha256(signingKey, stringToSign));

	init.headers.set(
		'Authorization',
		`AWS4-HMAC-SHA256 Credential=${AWS_ACCESS_KEY_ID}/${credentialScope},SignedHeaders=${signedHeaders},Signature=${signature}`
	);

	return fetch(input, init);
}
