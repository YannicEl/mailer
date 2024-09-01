<script lang="ts">
	import Footer from '$lib/components/Footer.svelte';
	import Logo from '$lib/components/Logo.svelte';
	import type { Snippet } from 'svelte';

	type Props = {
		children: Snippet;
	};
	const { children }: Props = $props();
</script>

<div class="flex min-h-screen w-full flex-col items-center justify-center">
	<div class=" flex w-full flex-1 items-center justify-center">
		<main class="min-h-100 sm:w-85 flex flex-col px-4 py-8">
			<Logo class="mx-auto mb-12 h-14 w-14 " />

			{@render children()}
		</main>
	</div>

	<Footer />
</div>
