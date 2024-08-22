import { z } from 'zod';

export const getDomainSchema = {
	response: z.object({
		id: z.string(),
		name: z.string(),
		status: z.enum(['PENDING', 'SUCCESS', 'FAILED', 'TEMPORARY_FAILURE', 'NOT_STARTED']),
	}),
};
