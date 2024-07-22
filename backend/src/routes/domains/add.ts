import { defineEventHandler } from 'h3-nightly';
import { getSESClient } from '../../utils/ses';

export default defineEventHandler(async (event) => {
	const ses = getSESClient(event);
	try {
		const identity = await ses.identities.create({
			EmailIdentity: 'asdexample.com',
		});

		console.log(identity);

		return Response.json(identity);
	} catch (error) {
		console.log(error.issues);
	}
});
