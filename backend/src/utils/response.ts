import type { Schema, z } from 'zod';

export function json<T extends Schema>(data: z.infer<T>, init?: RequestInit | Response): Response {
	return Response.json(JSON.stringify(data), init);
}
