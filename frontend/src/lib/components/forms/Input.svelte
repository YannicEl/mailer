<script lang="ts">
	import type { SvelteHTMLElements } from 'svelte/elements';

	type Props = {} & SvelteHTMLElements['input'];
	let { ...props }: Props = $props();
</script>

<input {...props} />
