<script lang="ts">
	import type { Snippet } from 'svelte';

	type Props = {
		type: 'error' | 'success' | 'warning';
		title?: string;
		children: Snippet;
	};
	const { type, title, children }: Props = $props();
</script>

<div class="flex gap-2">
	{#if type === 'error'}
		<div class="i-mdi-alert text-red-5 text-xl"></div>
	{:else if type === 'success'}
		<div class="i-mdi-check-circle text-green-5 text-xl"></div>
	{:else if type === 'warning'}
		<div class="i-mdi-alert text-yellow-5 text-xl"></div>
	{/if}
	<div>
		{#if title}
			<div class="font-medium">{title}</div>
		{/if}
		<div class="text-gray-5">{@render children()}</div>
	</div>
</div>
