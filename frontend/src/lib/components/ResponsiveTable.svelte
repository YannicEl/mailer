<script lang="ts" generics="T">
	import type { Snippet } from 'svelte';
	import { page as currentPage } from '$app/stores';
	import { preloadData } from '$app/navigation';

	type Props = {
		data: T[];
		header: Snippet;
		row: Snippet<[T]>;
		selection?: T[];
		pagination?: boolean;
		selectable?: boolean;
	};

	let {
		data,
		header,
		row,
		selection = $bindable([]),
		pagination = true,
		selectable = true,
	}: Props = $props();

	const searchParams = $derived($currentPage.url.searchParams);
	const page = $derived(Number(searchParams.get('page')) || 0);

	const nextLink = $derived.by(() => {
		const clonedParams = new URLSearchParams(searchParams);
		clonedParams.set('page', (page + 1).toString());
		return `?${clonedParams.toString()}`;
	});

	const backLink = $derived.by(() => {
		const clonedParams = new URLSearchParams(searchParams);
		clonedParams.set('page', Math.max(0, page - 1).toString());
		return `?${clonedParams.toString()}`;
	});

	let allSelected = $state(false);
	function selectAll(): void {
		if (allSelected) {
			selection = [];
		} else {
			selection = data;
		}
	}

	$effect(() => {
		preloadData(nextLink);
		preloadData(backLink);
	});
</script>

<table class="custom">
	<thead>
		<tr>
			{#if selectable}
				<th>
					<input type="checkbox" oninput={selectAll} bind:checked={allSelected} />
				</th>
			{/if}

			{@render header()}
		</tr>
	</thead>

	<tbody>
		{#each data as rowData (rowData)}
			<tr>
				{#if selectable}
					<td>
						<input type="checkbox" bind:group={selection} value={rowData} />
					</td>
				{/if}

				{@render row(rowData)}
			</tr>
		{/each}
	</tbody>
</table>

{#if pagination}
	<div class="flex gap-2">
		<a class="button primary" href={backLink}>back</a>
		<a class="button primary" href={nextLink}>next</a>
	</div>
{/if}
