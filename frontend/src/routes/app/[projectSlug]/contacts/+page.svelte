<script lang="ts">
	import ResponsiveTable from '$lib/components/ResponsiveTable.svelte';
	import { formatDate } from '$lib/format';
	import type { PageData } from './$types';

	type Props = { data: PageData };
	let { data }: Props = $props();

	type Contact = PageData['contacts'][number];
	let selection = $state<Contact[]>([]);
</script>

<h1>Contacts</h1>

<ResponsiveTable data={data.contacts} bind:selection>
	{#snippet header()}
		<th>Email</th>
		<th>CreatedAt</th>
	{/snippet}

	{#snippet row(contact)}
		<td>
			<a href="contacts/{contact.id}">{contact.email}</a>
		</td>
		<td>{formatDate(contact.createdAt)}</td>
	{/snippet}
</ResponsiveTable>
