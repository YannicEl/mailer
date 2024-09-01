import { z } from 'zod';

export const sendEmailSchema = {
	request: z.object({
		to: z.string().email(),
		from: z.string().email(),
		subject: z.string(),
		text: z.string().optional(),
		html: z.string().optional(),
	}),
	response: z.object({
		id: z.string(),
	}),
};
