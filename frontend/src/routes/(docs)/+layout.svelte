<script lang="ts">
	import Footer from '$lib/components/Footer.svelte';
	import Header from '$lib/components/Header.svelte';
	import type { Snippet } from 'svelte';

	type Props = {
		children: Snippet;
	};
	const { children }: Props = $props();
</script>

<div class="flex h-screen w-screen flex-col items-center justify-between px-4">
	<Header />

	<main class="flex h-full w-full max-w-md flex-col justify-center">
		<div class="max-h-lg flex h-full flex-col">
			{@render children()}
		</div>
	</main>

	<Footer />
</div>
