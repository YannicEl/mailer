<script lang="ts">
	import Sidebar from '$lib/components/Sidebar.svelte';
	import type { Snippet } from 'svelte';
	import type { LayoutData } from './$types';

	type Props = {
		data: LayoutData;
		children: Snippet;
	};
	const { data, children }: Props = $props();
</script>

<div class="flex h-screen">
	<Sidebar
		project={data.project.slug}
		class="border-r-1 border-r-gray-3 w-full max-w-[250px] p-4"
	/>

	<main class="w-full p-4">
		{@render children()}
	</main>
</div>
