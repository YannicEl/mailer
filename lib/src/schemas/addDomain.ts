import { z } from 'zod';

export const addDomainSchema = {
	request: z.object({
		name: z.string(),
	}),
	response: z.object({
		id: z.string(),
		name: z.string(),
		status: z.enum(['PENDING', 'SUCCESS', 'FAILED', 'TEMPORARY_FAILURE', 'NOT_STARTED']),
		records: z.array(
			z.object({
				type: z.string(),
				name: z.string(),
				value: z.string(),
			})
		),
	}),
};
