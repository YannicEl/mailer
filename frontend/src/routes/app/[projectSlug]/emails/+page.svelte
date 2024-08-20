<script lang="ts">
	import ResponsiveTable from '$lib/components/ResponsiveTable.svelte';
	import { formatDate } from '$lib/format';
	import type { PageData } from './$types';

	type Props = { data: PageData };
	let { data }: Props = $props();

	type ApiKey = PageData['emails'][number];
	let selection = $state<ApiKey[]>([]);
</script>

<h1>Email</h1>

<ResponsiveTable data={data.emails} bind:selection>
	{#snippet header()}
		<th>From</th>
		<th>To</th>
		<th>CreatedAt</th>
	{/snippet}

	{#snippet row(email)}
		<td>{email.from}</td>
		<td>{email.to}</td>
		<td>{formatDate(email.createdAt)}</td>
	{/snippet}
</ResponsiveTable>
