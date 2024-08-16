export type FormErrorType = keyof typeof ERRORS | (string & {});
export const ERRORS = {
	INVALID_EMAIL: {
		title: 'Invalid email',
		message: 'Please enter a valid email address.',
	},
	UNKNOWN_ERROR: {
		title: 'Unknown error',
		message: 'An unknown error occurred. Please try again later.',
	},
} as const;
