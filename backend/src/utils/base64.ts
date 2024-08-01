import { stringToArrayBuffer } from './crypto';

export function base64ToArrayBuffer(string: string): ArrayBuffer {
	const binaryString = atob(string);
	return stringToArrayBuffer(binaryString);
}
