import { schema } from '@mailer/db';
import { redirect } from '@sveltejs/kit';
import { and, eq } from 'drizzle-orm';

export const load = async ({ params, locals: { user: authUser, db } }) => {
	if (!authUser) redirect(302, '/signin');

	const [{ project, user }] = await db.drizzle
		.select()
		.from(schema.projectsToUsers)
		.innerJoin(schema.project, eq(schema.project.id, schema.projectsToUsers.projectId))
		.innerJoin(schema.user, eq(schema.user.id, schema.projectsToUsers.userId))
		.where(and(eq(schema.project.slug, params.projectSlug), eq(schema.user.id, authUser.id)));

	if (!project) {
		console.log(`project "${params.projectSlug}" not found`);
		redirect(302, '/app/personal');
	}

	return { project, user };
};
