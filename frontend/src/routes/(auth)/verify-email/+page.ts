export const load = ({ url }) => {
	const email = url.searchParams.get('email');
	if (typeof email === 'string') return { email };
};
