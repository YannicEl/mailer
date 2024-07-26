import { z } from 'zod';

export const sendEmail = {
	requestSchema: z.object({
		ConfigurationSetName: z.string().optional(),
		Content: z.object({
			Raw: z
				.object({
					Data: z.string(),
				})
				.optional(),
			Simple: z
				.object({
					Body: z
						.object({
							Html: z.object({
								Data: z.string(),
								Charset: z.string().optional(),
							}),
							Text: z.object({
								Data: z.string(),
								Charset: z.string().optional(),
							}),
						})
						.partial(),
					Subject: z.object({
						Data: z.string(),
						Charset: z.string().optional(),
					}),
					Headers: z
						.array(
							z.object({
								Name: z
									.string()
									.min(1)
									.max(126)
									.regex(/^[!-9;-@A-~]+$/),
								Value: z
									.string()
									.min(1)
									.max(870)
									.regex(/[ -~]*/),
							})
						)
						.min(0)
						.max(15)
						.optional(),
				})
				.optional(),
			Template: z
				.object({
					Headers: z
						.array(
							z.object({
								Name: z
									.string()
									.min(1)
									.max(126)
									.regex(/^[!-9;-@A-~]+$/),
								Value: z
									.string()
									.min(1)
									.max(870)
									.regex(/[ -~]*/),
							})
						)
						.min(0)
						.max(15)
						.optional(),
					TemplateArn: z.string().optional(),
					TemplateData: z.string().max(262144).optional(),
					TemplateName: z.string().min(1).optional(),
				})
				.optional(),
		}),
		Destination: z
			.object({
				BccAddresses: z.array(z.string()),
				CcAddresses: z.array(z.string()),
				ToAddresses: z.array(z.string()),
			})
			.partial()
			.optional(),
		EmailTags: z
			.array(
				z.object({
					Name: z
						.string()
						.max(256)
						.regex(/^[a-zA-Z0-9_-]+$/),
					Value: z
						.string()
						.max(256)
						.regex(/^[a-zA-Z0-9_-]+$/),
				})
			)
			.optional(),
		FeedbackForwardingEmailAddress: z.string().optional(),
		FeedbackForwardingEmailAddressIdentityArn: z.string().optional(),
		FromEmailAddress: z.string().optional(),
		FromEmailAddressIdentityArn: z.string().optional(),
		ListManagementOptions: z
			.object({
				ContactListName: z.string(),
				TopicName: z.string().optional(),
			})
			.optional(),
		ReplyToAddresses: z.array(z.string()).optional(),
	}),
	responseSchema: z.object({
		MessageId: z.string(),
	}),
};
