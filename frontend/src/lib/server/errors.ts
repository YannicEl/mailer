export type FormErrorType = keyof typeof ERRORS | (string & {});
export const ERRORS = {
	INVALID_FORM: {
		title: 'Invalid form',
		message: 'Please fill out all required fields.',
	},
	INVALID_EMAIL_OR_CODE: {
		title: 'Invalid email or code',
		message: 'The email or verification code you entered is invalid.',
	},
	INVALID_EMAIL: {
		title: 'Invalid email',
		message: 'Please enter a valid email address.',
	},
	UNKNOWN_ERROR: {
		title: 'Unknown error',
		message: 'An unknown error occurred. Please try again later.',
	},
} as const;
