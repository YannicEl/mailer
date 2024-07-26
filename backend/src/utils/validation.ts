import { Schema } from 'zod';

export async function validateJsonData<T>(schema: Schema<T>, request: Request): Promise<T> {
	const json = await request.json();
	return schema.parse(json);
}
