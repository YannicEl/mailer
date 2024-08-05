import type { DBProject } from '@mailer/db';
import { defineEventHandler, H3Event } from 'h3-nightly';
import { validateBearerToken } from '../auth';

type CustomEventHandlerParams = {
	auth?: boolean;
};

export function customEventHandler(
	{ auth = true }: CustomEventHandlerParams,
	handler: (event: H3Event, {}: { project: DBProject }) => Promise<Response>
) {
	return defineEventHandler(async (event) => {
		try {
			let project;
			if (auth) {
				project = await validateBearerToken(event);
				if (!project) return new Response('Unauthorized', { status: 401 });
			}

			return handler(event, { project: project! });
		} catch (error) {
			console.error(error);
			return new Response('Internal Server Error', { status: 500 });
		}
	});
}
