<script lang="ts">
	import { enhance } from '$app/forms';
	import type { SubmitFunction } from '@sveltejs/kit';
	import type { Snippet } from 'svelte';
	import type { SvelteHTMLElements } from 'svelte/elements';

	type Props = {
		children: Snippet<[{ loading: boolean }]>;
		submit?: SubmitFunction;
	} & SvelteHTMLElements['form'];
	let { children, submit, ...props }: Props = $props();

	let loading = $state(false);
	const wrappedSubmit: SubmitFunction = async (input) => {
		loading = true;
		const callback = await submit?.(input);

		return async (action) => {
			loading = false;

			if (callback) {
				await callback(action);
			} else {
				await action.update();
			}
		};
	};
</script>

<form method="post" {...props} use:enhance={wrappedSubmit}>
	{@render children({ loading })}
</form>
