import { z } from 'zod';

export const addDomainSchema = {
	request: z.object({
		name: z.string(),
	}),
	response: z.object({
		name: z.string(),
	}),
};
