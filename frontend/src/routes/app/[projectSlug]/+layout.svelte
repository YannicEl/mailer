<script lang="ts">
	import Sidebar from '$lib/components/Sidebar.svelte';
</script>

<div class="flex h-screen">
	<Sidebar class="border-r-1 border-r-gray-3 w-full max-w-[250px] p-4" />

	<main class="w-full p-4">
		<slot />
	</main>
</div>
