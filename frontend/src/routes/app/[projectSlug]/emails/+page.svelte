<script lang="ts">
	import ResponsiveTable from '$lib/components/ResponsiveTable.svelte';
	import { formatDate } from '$lib/format';
	import type { PageData } from './$types';

	type Props = { data: PageData };
	let { data }: Props = $props();

	type Email = PageData['emails'][number];
	let selection = $state<Email[]>([]);
</script>

<h1>Email</h1>

<ResponsiveTable data={data.emails} bind:selection>
	{#snippet header()}
		<th>From</th>
		<th>To</th>
		<th>CreatedAt</th>
		<th></th>
	{/snippet}

	{#snippet row(email)}
		<td>
			<a href="senders/{email.sender.id}">{email.sender.email}</a>
		</td>
		<td>
			<a href="contacts/{email.contact.id}">{email.contact.email}</a>
		</td>
		<td>{formatDate(email.createdAt)}</td>
		<td>
			<a class="button" href="emails/{email.id}">details</a>
		</td>
	{/snippet}
</ResponsiveTable>
