<script lang="ts">
	import ResponsiveTable from '$lib/components/ResponsiveTable.svelte';
	import { formatDate } from '$lib/format';
	import type { PageData } from './$types';

	type Props = { data: PageData };
	let { data }: Props = $props();
</script>

<div>Sender: {data.sender.id}</div>
<div>Email: {data.sender.email}</div>
<div>CreatedAt: {formatDate(data.sender.createdAt)}</div>

<ResponsiveTable data={data.sender.emails} selectable={false} pagination={false}>
	{#snippet header()}
		<th>From</th>
		<th>CreatedAt</th>
	{/snippet}

	{#snippet row(email)}
		<td>
			<a href="/app/{data.project.slug}/contacts/{email.contact.id}">{email.contact.email}</a>
		</td>
		<td>{formatDate(email.createdAt)}</td>
	{/snippet}
</ResponsiveTable>
