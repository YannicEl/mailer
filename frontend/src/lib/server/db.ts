import { context, useEvent } from '$lib/server/context';
import type { DB, DBProject } from '@mailer/db';
import { getDb, schema } from '@mailer/db';
import type { DBUser } from '@mailer/db/src/schema/user.schema';
import { error, redirect, type RequestEvent } from '@sveltejs/kit';
import { and, eq } from 'drizzle-orm';

export function useDb(event?: RequestEvent): DB {
	if (context.db) return context.db;

	if (!event) event = useEvent();
	if (!event) error(500, 'event not found');
	if (!event.platform?.env) throw new Error('Cloudflare bindings not found');

	context.db = getDb(event.platform.env.DB);
	return context.db;
}

export async function getProjectAndUser(): Promise<{
	project: DBProject;
	user: DBUser;
}> {
	const db = useDb();
	const event = useEvent();

	const { projectSlug } = event.params;
	if (!projectSlug) throw new Error('Project Slug not found');

	if (!event.locals.user) throw new Error('User not found');

	const [query] = await db.drizzle
		.select()
		.from(schema.projectsToUsers)
		.innerJoin(schema.project, eq(schema.project.id, schema.projectsToUsers.projectId))
		.innerJoin(schema.user, eq(schema.user.id, schema.projectsToUsers.userId))
		.where(and(eq(schema.project.slug, projectSlug), eq(schema.user.id, event.locals.user.id)));

	const { project, user } = query ?? {};

	if (!project) redirect(302, '/app');
	if (!user) redirect(302, '/signin');

	return { project, user };
}
