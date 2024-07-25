import { dev } from '$app/environment';
import { DrizzleSQLiteAdapter } from '@lucia-auth/adapter-drizzle';
import type { DB } from '@mailer/db';
import { schema } from '@mailer/db';
import { Lucia } from 'lucia';

export function getLuciaDbAdapter(db: DB): DrizzleSQLiteAdapter {
	const adapter = new DrizzleSQLiteAdapter(db, schema.session, schema.user);
	return adapter;
}

export function getLucia(db: DB) {
	const adapter = getLuciaDbAdapter(db);
	const lucia = new Lucia(adapter, {
		sessionCookie: {
			attributes: {
				// set to `true` when using HTTPS
				secure: !dev,
			},
		},
	});

	return lucia;
}

declare module 'lucia' {
	interface Register {
		Lucia: ReturnType<typeof getLucia>;
		UserId: number;
	}
}
