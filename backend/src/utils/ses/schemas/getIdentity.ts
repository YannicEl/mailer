import { z } from 'zod';

export const getIdentity = {
	responseSchema: z.object({
		ConfigurationSetName: z.string(),
		DkimAttributes: z
			.object({
				CurrentSigningKeyLength: z.enum(['RSA_1024_BIT', 'RSA_2048_BIT']),
				LastKeyGenerationTimestamp: z.number(),
				NextSigningKeyLength: z.enum(['RSA_1024_BIT', 'RSA_2048_BIT']),
				SigningAttributesOrigin: z.enum(['AWS_SES', 'EXTERNAL']),
				SigningEnabled: z.boolean(),
				Status: z.enum(['PENDING', 'SUCCESS', 'FAILED', 'TEMPORARY_FAILURE', 'NOT_STARTED']),
				Tokens: z.array(z.string()),
			})
			.partial(),
		FeedbackForwardingStatus: z.boolean(),
		IdentityType: z.enum(['DOMAIN', 'EMAIL_ADDRESS', 'MANAGED_DOMAIN']),
		MailFromAttributes: z.object({
			BehaviorOnMxFailure: z.enum(['USE_DEFAULT_VALUE', 'REJECT_MESSAGE']),
			MailFromDomain: z.string().or(z.null()),
			MailFromDomainStatus: z
				.enum(['PENDING', 'SUCCESS', 'FAILED', 'TEMPORARY_FAILURE'])
				.or(z.null()),
		}),
		Policies: z.record(z.string(), z.string()),
		Tags: z.array(
			z.object({
				Key: z.string(),
				Value: z.string(),
			})
		),
		VerificationInfo: z
			.object({
				ErrorType: z
					.enum([
						'SERVICE_ERROR',
						'DNS_SERVER_ERROR',
						'HOST_NOT_FOUND',
						'TYPE_NOT_FOUND',
						'INVALID_VALUE',
					])
					.or(z.null()),
				LastCheckedTimestamp: z.number().or(z.null()),
				LastSuccessTimestamp: z.number().or(z.null()),
				SOARecord: z
					.object({
						AdminEmail: z.string(),
						PrimaryNameServer: z.string(),
						SerialNumber: z.number(),
					})
					.partial()
					.or(z.null()),
			})
			.partial(),
		VerificationStatus: z.enum([
			'PENDING',
			'SUCCESS',
			'FAILED',
			'TEMPORARY_FAILURE',
			'NOT_STARTED',
		]),
		VerifiedForSendingStatus: z.boolean(),
	}),
};
