<script lang="ts">
	import ResponsiveTable from '$lib/components/ResponsiveTable.svelte';
	import type { PageData } from './$types';

	type Props = { data: PageData };
	let { data }: Props = $props();
</script>

<h1>Api Keys</h1>

<ResponsiveTable data={data.apiKeys}>
	{#snippet header()}
		<th>ID</th>
		<th>Key</th>
		<th>CreatedAt</th>
	{/snippet}

	{#snippet row({ id, key, createdAt })}
		<td>{id}</td>
		<td>{key}</td>
		<td>{createdAt}</td>
	{/snippet}
</ResponsiveTable>
