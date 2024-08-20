<script lang="ts">
	import { enhance } from '$app/forms';
	import ResponsiveTable from '$lib/components/ResponsiveTable.svelte';
	import { formatDate } from '$lib/format';
	import type { PageData } from './$types';

	type Props = { data: PageData };
	let { data }: Props = $props();

	type ApiKey = PageData['domains'][number];
	let selection = $state<ApiKey[]>([]);

	function doSomething(apiKey: ApiKey): void {
		console.log(apiKey);
	}
</script>

<h1>Domains</h1>

<ResponsiveTable data={data.domains} bind:selection>
	{#snippet header()}
		<th>Name</th>
		<th>CreatedAt</th>
		<th></th>
	{/snippet}

	{#snippet row(domain)}
		<td>{domain.name}</td>
		<td>{formatDate(domain.createdAt)}</td>
		<td>
			<button onclick={() => doSomething(domain)}>...</button>
		</td>
	{/snippet}
</ResponsiveTable>
