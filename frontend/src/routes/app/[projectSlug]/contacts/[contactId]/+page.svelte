<script lang="ts">
	import ResponsiveTable from '$lib/components/ResponsiveTable.svelte';
	import { formatDate } from '$lib/format';
	import type { PageData } from './$types';

	type Props = { data: PageData };
	let { data }: Props = $props();
</script>

<div>Sender: {data.contact.id}</div>
<div>Email: {data.contact.email}</div>
<div>CreatedAt: {formatDate(data.contact.createdAt)}</div>

<ResponsiveTable data={data.contact.emails} selectable={false} pagination={false}>
	{#snippet header()}
		<th>From</th>
		<th>CreatedAt</th>
	{/snippet}

	{#snippet row(email)}
		<td>
			<a href="/app/{data.project.slug}/senders/{email.sender.id}">{email.sender.email}</a>
		</td>
		<td>{formatDate(email.createdAt)}</td>
	{/snippet}
</ResponsiveTable>
