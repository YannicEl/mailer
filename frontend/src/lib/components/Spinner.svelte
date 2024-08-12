<script lang="ts">
	import type { SvelteHTMLElements } from 'svelte/elements';
	type Props = {} & SvelteHTMLElements['svg'];
	let { ...props }: Props = $props();
</script>

<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
	<circle cx="12" cy="12" r="10" />
</svg>

<style>
	circle {
		stroke: currentColor;
		stroke-width: 2;
		stroke-linecap: round;
		stroke-dasharray: 70;
		stroke-dashoffset: 30;
		fill: transparent;
		animation: rotation 0.6s linear infinite;
		transform-origin: center;
	}

	@keyframes rotation {
		100% {
			transform: rotate(1turn);
		}
	}
</style>
