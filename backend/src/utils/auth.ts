import type { H3Event } from 'h3-nightly';

export async function validateToken(event: H3Event): Promise<void> {
	const token = event.request.headers.get('Authorization');
	if (!token) return new Response('Unauthorized', { status: 401 });
}
