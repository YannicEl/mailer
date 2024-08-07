import { defineApiClient } from '@yannicel/typed-api';
import { z } from 'zod';

export type MailerOptions = {
	apiKey: string;
	baseUrl: string;
};

export function defineMailerClient({ apiKey, baseUrl }: MailerOptions) {
	return defineApiClient({
		baseUrl,
		globalHeaders: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${apiKey}`,
		},
		endpoints: {
			emails: {
				endpoints: {
					send: {
						requestInit: {
							method: 'POST',
						},
						requestSchema: z.object({
							to: z.string(),
							from: z.string(),
							subject: z.string(),
							body: z.string(),
						}),
						responseSchema: z.object({
							messageId: z.string(),
						}),
					},
				},
			},
		},
	});
}
