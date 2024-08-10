<script lang="ts" generics="T">
	import type { Snippet } from 'svelte';

	type Props = {
		data: T[];
		header: Snippet;
		row: Snippet<[T]>;
	};
	let { data, header, row }: Props = $props();
</script>

<table class="w-full rounded-sm border">
	<thead class="bg-gray-1">
		<tr class="text-left">
			{@render header()}
		</tr>
	</thead>

	<tbody>
		{#each data as rowData}
			<tr>
				{@render row(rowData)}
			</tr>
		{/each}
	</tbody>
</table>

<style lang="scss">
</style>
