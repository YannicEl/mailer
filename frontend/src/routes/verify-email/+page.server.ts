import { validateFormData } from '$lib/server/validation';
import type { DB } from '@mailer/db';
import { schema as tables } from '@mailer/db';
import { error, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import type { User } from 'lucia';
import { isWithinExpirationDate } from 'oslo';
import { z } from 'zod';

const schema = z.object({
	verificationCode: z.string(),
});

export const load = async ({ locals: { user } }) => {
	return { email: user?.email };
};

export const actions = {
	default: async ({ request, cookies, locals: { db, user, lucia } }) => {
		const data = await validateFormData(schema, request);
		if (!user) return error(401, 'Unauthorized');

		const validCode = await verifyVerificationCode(db, user, data.verificationCode);
		if (!validCode) return error(401, 'Unauthorized');

		await lucia.invalidateUserSessions(user.id);
		await db.update(tables.users).set({ emailVerified: true }).where(eq(tables.users.id, user.id));

		const session = await lucia.createSession(user.id, {});
		const sessionCookie = lucia.createSessionCookie(session.id);

		cookies.set(sessionCookie.name, sessionCookie.value, {
			path: '.',
			...sessionCookie.attributes,
		});

		redirect(302, '/');
	},
};

async function verifyVerificationCode(db: DB, user: User, code: string): Promise<boolean> {
	const databaseCode = await db.query.emailVerificationCodes.findFirst({
		where: eq(tables.emailVerificationCodes.code, code),
	});

	if (!databaseCode || databaseCode.code !== code) return false;

	await db
		.delete(tables.emailVerificationCodes)
		.where(eq(tables.emailVerificationCodes.id, databaseCode.id));

	if (!isWithinExpirationDate(databaseCode.expiresAt)) {
		console.log('Code expired');
		return false;
	}

	if (databaseCode.email !== user.email) return false;

	return true;
}
