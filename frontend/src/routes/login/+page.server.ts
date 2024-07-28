export const load = async ({ fetch }) => {
	const res = await fetch('/api/auth/login', {
		method: 'POST',
	});
	const json = await res.json();

	return json;
};

export const actions = {
	default: async ({ fetch }) => {
		const res = await fetch('/api/auth/login', {
			method: 'POST',
		});
		const json = await res.json();

		return json;
	},
};
