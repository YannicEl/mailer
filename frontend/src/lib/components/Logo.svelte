<script lang="ts">
	import type { SvelteHTMLElements } from 'svelte/elements';

	type Props = {} & SvelteHTMLElements['svg'];
	let { ...props }: Props = $props();
</script>

<svg viewBox="0 0 77 71" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
	<path
		fill-rule="evenodd"
		clip-rule="evenodd"
		d="m22.158.1 15.095 7.82-22.08 42.62L.08 42.72 22.158.1Zm39.069 20.24 15.095 7.819-22.08 42.62-15.095-7.82 22.08-42.62Zm.16-11.18L46.292 1.34l-15.64 30.19 15.096 7.82L61.386 9.16Z"
		fill="#000"
	/>
</svg>
