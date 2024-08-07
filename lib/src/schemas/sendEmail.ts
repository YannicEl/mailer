import { z } from 'zod';

export const sendEmailSchema = {
	request: z.object({
		to: z.string().email(),
		from: z.string().email(),
		subject: z.string(),
		body: z.string(),
	}),
	response: z.object({
		messageId: z.string(),
	}),
};
