<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { SvelteHTMLElements } from 'svelte/elements';

	type Props = { children: Snippet } & SvelteHTMLElements['select'];
	let { children, ...props }: Props = $props();
</script>

<select {...props}>
	{@render children()}
</select>
