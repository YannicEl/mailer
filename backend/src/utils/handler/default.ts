import type { DBProject } from '@mailer/db';
import type { H3Event } from 'h3-nightly';
import { defineEventHandler } from 'h3-nightly';
import { validateBearerToken } from '../auth';

type CustomEventHandlerParams = {
	auth?: boolean;
};

export function customEventHandler(
	{ auth = true }: CustomEventHandlerParams,
	handler: (event: H3Event, ctx: { project: DBProject }) => Promise<Response>
) {
	return defineEventHandler(async (event) => {
		try {
			let project;
			if (auth) {
				project = await validateBearerToken(event);
				if (!project) return new Response('Unauthorized', { status: 401 });
			}

			const response = await handler(event, { project: project! });
			return response;
		} catch (error) {
			console.error(error);
			return new Response('Internal Server Error', { status: 500 });
		}
	});
}
