import { PRIVATE_MAILER_API_KEY } from '$env/static/private';
import { PUBLIC_BACKEND_URL } from '$env/static/public';
import { defineMailerClient } from '@mailer/lib';

export const mailer = defineMailerClient({
	baseUrl: PUBLIC_BACKEND_URL,
	apiKey: PRIVATE_MAILER_API_KEY,
});
