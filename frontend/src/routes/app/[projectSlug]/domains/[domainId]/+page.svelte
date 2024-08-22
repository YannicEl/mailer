<script lang="ts">
	import ResponsiveTable from '$lib/components/ResponsiveTable.svelte';
	import { formatDate } from '$lib/format';
	import type { PageData } from './$types';

	type Props = { data: PageData };
	let { data }: Props = $props();
</script>

<div>Domain: {data.domain.id}</div>
<div>Name: {data.domain.name}</div>
<div>CreatedAt: {formatDate(data.domain.createdAt)}</div>

<ResponsiveTable data={data.domain.dnsRecords} selectable={false} pagination={false}>
	{#snippet header()}
		<th>Type</th>
		<th>Name</th>
		<th>Value</th>
	{/snippet}

	{#snippet row(record)}
		<td>{record.type}</td>
		<td>{record.name}</td>
		<td>{record.value}</td>
	{/snippet}
</ResponsiveTable>
