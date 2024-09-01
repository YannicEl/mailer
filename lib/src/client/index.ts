import { defineApiClient } from '@yannicel/typed-api';
import { addDomainSchema } from '../schemas/addDomain';
import { getDomainSchema } from '../schemas/getDomain';
import { sendEmailSchema } from '../schemas/sendEmail';

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
						requestSchema: sendEmailSchema.request,
						responseSchema: sendEmailSchema.response,
					},
				},
			},
			domains: {
				endpoints: {
					add: {
						path: '/',
						requestInit: {
							method: 'POST',
						},
						requestSchema: addDomainSchema.request,
						responseSchema: addDomainSchema.response,
					},
					get: {
						path: '/:domain_id',
						requestInit: {
							method: 'GET',
						},
						responseSchema: getDomainSchema.response,
					},
					delete: {
						path: '/:domain_id',
						requestInit: {
							method: 'DELETE',
						},
					},
				},
			},
		},
	});
}
