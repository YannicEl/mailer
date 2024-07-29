import { useDb } from '$lib/server/db.js';
import { validateFormData } from '$lib/server/validation';
import { error, redirect } from '@sveltejs/kit';
import type { User } from 'lucia';
import { isWithinExpirationDate } from 'oslo';
import { z } from 'zod';

const schema = z.object({
	verificationCode: z.string(),
});

export const load = async ({ locals: { user } }) => {
	if (!user) return redirect(302, '/login');
	if (user.emailVerified) redirect(302, '/app');

	return { email: user.email };
};

export const actions = {
	default: async ({ request, cookies, locals: { db, user, lucia } }) => {
		const { verificationCode } = await validateFormData(schema, request);

		if (!user) return error(401, 'Unauthorized');

		const validCode = await verifyVerificationCode(user, verificationCode);
		if (!validCode) return error(401, 'Unauthorized');

		await lucia.invalidateUserSessions(user.id);
		await db.users.update({ emailVerified: true }, (table, { eq }) => eq(table.id, user.id));

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

	const databaseCode = await db.emailVerificationCodes.query.findFirst({
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

	await db.emailVerificationCodes.delete((table, { eq }) => eq(table.id, databaseCode.id));

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
