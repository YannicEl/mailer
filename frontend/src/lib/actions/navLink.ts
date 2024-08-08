import { page } from '$app/stores';
import type { Action } from 'svelte/action';

export const navLink: Action<HTMLAnchorElement> = (node) => {
	const linkPath = new URL(node.href).pathname;

	const unsubscribe = page.subscribe((value) => {
		const pagePath = value.url.pathname;
		if (linkPath === pagePath) {
			node.classList.add('active');
		} else {
			node.classList.remove('active');
		}
	});

	return {
		destroy() {
			unsubscribe();
		},
	};
};
