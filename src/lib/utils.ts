export function bufferToHex(value: ArrayBuffer): string {
	const buffer = new Uint8Array(value);

	let hexString = '';
	for (let i = 0; i < buffer.length; i++) {
		hexString += buffer[i].toString(16).padStart(2, '0');
	}

	return hexString;
}

export function stringToArrayBuffer(value: string): ArrayBuffer {
	return new TextEncoder().encode(value);
}

export function sha256(value: string): Promise<ArrayBuffer> {
	const buffer = stringToArrayBuffer(value);
	return crypto.subtle.digest('SHA-256', buffer);
}

export async function hmacSha256(
	key: string | ArrayBuffer,
	value: string
): Promise<ArrayBuffer> {
	const cryptoKey = await crypto.subtle.importKey(
		'raw',
		typeof key === 'string' ? stringToArrayBuffer(key) : key,
		{ name: 'HMAC', hash: 'SHA-256' },
		false,
		['sign']
	);

	return crypto.subtle.sign('HMAC', cryptoKey, stringToArrayBuffer(value));
}
