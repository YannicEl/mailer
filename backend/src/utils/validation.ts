import type { H3Event } from 'h3-nightly';
import { Schema } from 'zod';

export async function validateJsonData<T>(schema: Schema<T>, request: Request): Promise<T> {
	const json = await request.json();
	return schema.parse(json);
}

export function validatePathParameters<T>(schema: Schema<T>, event: H3Event): T {
	return schema.parse(event.context.params ?? {});
}
