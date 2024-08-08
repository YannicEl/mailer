<script lang="ts">
	import Sidebar from '$lib/components/Sidebar.svelte';
</script>

<div class="flex h-screen gap-4">
	<Sidebar class="border-r-1 border-r-gray-3 w-full max-w-[250px] p-4" />

	<main class="p-4">
		<slot />
	</main>
</div>
