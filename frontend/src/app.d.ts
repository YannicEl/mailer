import type { getLucia } from '$lib/server/auth';
import type { DB } from '@mailer/db';

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			db: DB;
			user: import('lucia').User | null;
			session: import('lucia').Session | null;
			lucia: ReturnType<typeof getLucia>;
		}
		// interface PageData {}
		// interface PageState {}
		interface Platform {
			env: Env;
			cf: CfProperties;
			ctx: ExecutionContext;
		}
	}
}

export {};
