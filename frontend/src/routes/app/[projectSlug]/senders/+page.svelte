<script lang="ts">
	import ResponsiveTable from '$lib/components/ResponsiveTable.svelte';
	import { formatDate } from '$lib/format';
	import type { PageData } from './$types';

	type Props = { data: PageData };
	let { data }: Props = $props();

	type Sender = PageData['senders'][number];
	let selection = $state<Sender[]>([]);
</script>

<h1>Senders</h1>

<ResponsiveTable data={data.senders} bind:selection>
	{#snippet header()}
		<th>Name</th>
		<th>Email</th>
		<th>CreatedAt</th>
	{/snippet}

	{#snippet row(sender)}
		<td>{sender.name}</td>
		<td>
			<a href="senders/{sender.id}">{sender.email}</a>
		</td>
		<td>{formatDate(sender.createdAt)}</td>
	{/snippet}
</ResponsiveTable>
