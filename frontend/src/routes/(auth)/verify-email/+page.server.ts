import { useDb } from '$lib/server/db.js';
import { ERRORS } from '$lib/server/errors';
import { validateFormData } from '$lib/server/validation';
import { fail, redirect } from '@sveltejs/kit';
import type { User } from 'lucia';
import { isWithinExpirationDate } from 'oslo';
import { z } from 'zod';

export const load = async ({ locals: { user } }) => {
	if (user?.emailVerified) redirect(302, '/app');
};

const schema = z.object({
	email: z.string().email(),
	verificationCode: z.string(),
});

export const actions = {
	default: async ({ request, cookies, locals: { db, lucia } }) => {
		const { data, success } = await validateFormData(schema, request);
		if (!success) return fail(400, { error: ERRORS.INVALID_FORM });

		const user = await db.user.query.findFirst({
			where: (table, { eq }) => eq(table.email, data.email),
		});

		if (!user) return fail(400, { error: ERRORS.INVALID_EMAIL_OR_CODE });

		const validCode = await verifyVerificationCode(user, data.verificationCode);
		if (!validCode) return fail(400, { error: ERRORS.INVALID_EMAIL_OR_CODE });

		await lucia.invalidateUserSessions(user.id);
		await db.user.update({ emailVerified: true }, (table, { eq }) => eq(table.id, user.id));

		const session = await lucia.createSession(user.id, {});
		const sessionCookie = lucia.createSessionCookie(session.id);

		cookies.set(sessionCookie.name, sessionCookie.value, {
			path: '.',
			...sessionCookie.attributes,
		});

		redirect(302, '/app');
	},
};

async function verifyVerificationCode(user: User, code: string): Promise<boolean> {
	const db = useDb();

	const databaseCode = await db.emailVerificationCode.query.findFirst({
		where: (table, { eq }) => eq(table.code, code),
	});

	if (!databaseCode) {
		console.log('Code not found');
		return false;
	}

	if (databaseCode.code !== code) {
		console.log('Code doesnt match');
		return false;
	}

	await db.emailVerificationCode.delete((table, { eq }) => eq(table.id, databaseCode.id));

	if (!isWithinExpirationDate(databaseCode.expiresAt)) {
		console.log('Code expired');
		return false;
	}

	if (databaseCode.email !== user.email) {
		console.log('Email doesnt match');
		return false;
	}

	return true;
}
