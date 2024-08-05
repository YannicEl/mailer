import { z } from 'zod';
import { snsEventHandler } from '../../utils/handler/sns';

const messageSchema = z.object({
	type: z.string(),
});

export default snsEventHandler({ messageSchema }, async (event, message) => {
	console.log({ message });
	return new Response('OK');
});
