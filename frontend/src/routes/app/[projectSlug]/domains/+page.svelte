<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import Form from '$lib/components/forms/Form.svelte';
	import ResponsiveTable from '$lib/components/ResponsiveTable.svelte';
	import { formatDate } from '$lib/format';
	import type { PageData } from './$types';

	type Props = { data: PageData };
	let { data }: Props = $props();

	type Domain = PageData['domains'][number];
	let selection = $state<Domain[]>([]);
</script>

<h1>Domains</h1>

<a class="button" href="domains/add">Add domain</a>

<ResponsiveTable data={data.domains} bind:selection>
	{#snippet header()}
		<th>Id</th>
		<th>Name</th>
		<th>Status</th>
		<th>CreatedAt</th>
		<th></th>
	{/snippet}

	{#snippet row(domain)}
		<td>{domain.id}</td>
		<td>
			<a href="domains/{domain.id}">{domain.name}</a>
		</td>
		<td>{domain.status}</td>
		<td>{formatDate(domain.createdAt)}</td>
		<td>
			<Form method="post" action="?/remove">
				{#snippet children({ loading })}
					<input type="hidden" name="domainId" value={domain.id} />
					<Button {loading}>Remove {domain.id}</Button>
				{/snippet}
			</Form>
		</td>
	{/snippet}
</ResponsiveTable>
