<script lang="ts">
	import ResponsiveTable from '$lib/components/ResponsiveTable.svelte';
	import { formatDate } from '$lib/format';
	import type { PageData } from './$types';

	type Props = { data: PageData };
	let { data }: Props = $props();
</script>

<div>Email: {data.email.id}</div>
<div>
	Sender: <a href="/app/{data.project.slug}/senders/{data.email.sender.id}">
		{data.email.sender.email}
	</a>
</div>
<div>
	Contact: <a href="/app/{data.project.slug}/contacts/{data.email.contact.id}">
		{data.email.contact.email}
	</a>
</div>
<div>CreatedAt: {formatDate(data.email.createdAt)}</div>

<ResponsiveTable data={data.email.events} selectable={false} pagination={false}>
	{#snippet header()}
		<th>Type</th>
		<th>CreatedAt</th>
	{/snippet}

	{#snippet row(event)}
		<td>
			{event.type}
		</td>
		<td>{formatDate(event.createdAt)}</td>
	{/snippet}
</ResponsiveTable>
