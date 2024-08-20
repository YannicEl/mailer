import { z } from 'zod';

export const createIdentity = {
	requestSchema: z.object({
		ConfigurationSetName: z.string().optional(),
		DkimSigningAttributes: z
			.object({
				DomainSigningPrivateKey: z.string().regex(/^[a-zA-Z0-9+/]+={0,2}$/),
				DomainSigningSelector: z
					.string()
					.regex(/^(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\-]*[a-zA-Z0-9]))$/),
				NextSigningKeyLength: z.enum(['RSA_1024_BIT', 'RSA_2048_BIT']),
			})
			.partial()
			.optional(),
		EmailIdentity: z.string().min(1),
		Tags: z
			.array(
				z.object({
					Key: z.string(),
					Value: z.string(),
				})
			)
			.optional(),
	}),
	responseSchema: z.object({
		DkimAttributes: z
			.object({
				CurrentSigningKeyLength: z.enum(['RSA_1024_BIT', 'RSA_2048_BIT']),
				LastKeyGenerationTimestamp: z.number().optional(),
				NextSigningKeyLength: z.enum(['RSA_1024_BIT', 'RSA_2048_BIT']),
				SigningAttributesOrigin: z.enum(['AWS_SES', 'EXTERNAL']),
				SigningEnabled: z.boolean().optional(),
				Status: z.enum(['PENDING', 'SUCCESS', 'FAILED', 'TEMPORARY_FAILURE', 'NOT_STARTED']),
				Tokens: z.array(z.string()).optional(),
			})
			.partial(),
		IdentityType: z.enum(['DOMAIN', 'EMAIL_ADDRESS', 'MANAGED_DOMAIN']),
		VerifiedForSendingStatus: z.boolean(),
	}),
};
