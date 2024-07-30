import { defineEventHandler } from 'h3-nightly';

export default defineEventHandler(async (event) => {
	const snsMessageType = event.request.headers.get('x-amz-sns-message-type');
	if (snsMessageType === 'SubscriptionConfirmation') {
	} else if (snsMessageType === 'Notification') {
		const message = await event.request.json();
		console.log(message);
	}

	const text = await event.request.text();
	console.log(text);

	return new Response('OK');
});
