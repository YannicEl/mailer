import type { BeforeRequestHook } from '@yannicel/typed-api';
import { bufferToHex, hmacSha256, sha256 } from './crypto';

export type SignWithAwsV4Params = {
	region: string;
	secretAccessKey: string;
	accessKeyId: string;
};
export function signWithAwsV4({
	region,
	accessKeyId,
	secretAccessKey,
}: SignWithAwsV4Params): BeforeRequestHook {
	return async ({ path, requestInit }) => {
		const url = typeof path === 'string' ? new URL(path) : path;

		const headers = new Headers(requestInit.headers);

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

		const canonicalHeaders = sortedHeaders.map(({ key, value }) => `${key}:${value}`).join('\n');

		const signedHeaders = sortedHeaders.map(({ key }) => key).join(';');

		const hashedPayload = bufferToHex(await sha256((requestInit.body as string) ?? ''));

		const canonicalRequest = [
			requestInit.method?.toUpperCase(),
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

		const dateKey = await hmacSha256(`AWS4${secretAccessKey}`, requestDateTimeYYYYMMDD);
		const dateRegionKey = await hmacSha256(dateKey, region);
		const dateRegionServiceKey = await hmacSha256(dateRegionKey, 'ses');
		const signingKey = await hmacSha256(dateRegionServiceKey, 'aws4_request');
		const signature = bufferToHex(await hmacSha256(signingKey, stringToSign));

		headers.set(
			'Authorization',
			`AWS4-HMAC-SHA256 Credential=${accessKeyId}/${credentialScope},SignedHeaders=${signedHeaders},Signature=${signature}`
		);

		requestInit.headers = headers;

		return { path, requestInit };
	};
}
