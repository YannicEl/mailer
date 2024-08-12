<script lang="ts">
	import type { SvelteHTMLElements } from 'svelte/elements';
	import type { Snippet } from 'svelte';
	import Spinner from './Spinner.svelte';

	type Props = {
		loading?: boolean;
		icon?: string;
		children: Snippet;
	} & SvelteHTMLElements['button'];

	const { loading, icon, children, ...props }: Props = $props();
</script>

<button disabled={loading} {...props}>
	{#if loading}
		<Spinner class="absolute left-1/2 top-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2" />
	{/if}

	{#if children}
		<span class={loading ? 'opacity-0' : ''}>{@render children()}</span>
	{/if}

	{#if icon}
		<span class={`${icon} ${loading ? 'opacity-0' : ''}`}></span>
	{/if}
</button>

<style>
	button {
		--apply: flex relative items-center justify-center bg-black gap-2 rounded-md px-2 py-1
			text-white w-full;
	}
</style>
