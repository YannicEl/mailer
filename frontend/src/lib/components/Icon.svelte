<script lang="ts">
	import type { SvelteHTMLElements } from 'svelte/elements';

	type Props = {
		icon: string;
	} & SvelteHTMLElements['span'];
	let { icon, ...props }: Props = $props();
</script>

<span class={icon} {...props}></span>

<style>
	span {
		width: 1em;
		height: 1em;
		fill: currentColor;
	}
</style>
