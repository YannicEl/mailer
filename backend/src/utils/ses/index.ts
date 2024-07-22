import { defineApiClient } from '@yannicel/typed-api';
import { H3Event } from 'h3-nightly';
import { signWithAwsV4 } from '../aws';
import { createIdentity } from './schemas/createIdentity';
import { getIdentity } from './schemas/getIdentity';

export function getSESClient(event: H3Event) {
	const env = event.context.env as Env;

	const region = env.AWS_REGION;
	const baseUrl = `https://email.${region}.amazonaws.com/v2/email`;

	const beforeRequest = signWithAwsV4({
		region,
		secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
		accessKeyId: env.AWS_ACCESS_KEY_ID,
	});

	return defineApiClient({
		baseUrl,
		globalHooks: {
			beforeRequest,
		},
		globalHeaders: {
			'Content-type': 'application/json',
		},
		endpoints: {
			identities: {
				endpoints: {
					create: {
						path: '/',
						requestInit: {
							method: 'POST',
						},
						requestSchema: createIdentity.requestSchema,
						responseSchema: createIdentity.responseSchema,
					},
					get: {
						path: '/',
						requestInit: {
							method: 'GET',
						},
						responseSchema: getIdentity.responseSchema,
					},
					delete: {
						path: '/',
						requestInit: {
							method: 'DELETE',
						},
					},
				},
			},
			emails: {
				path: '/',
				endpoints: {
					send: {
						path: '/',
					},
				},
			},
		},
	});
}
