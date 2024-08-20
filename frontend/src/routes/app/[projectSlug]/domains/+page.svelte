<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import Form from '$lib/components/forms/Form.svelte';
	import ResponsiveTable from '$lib/components/ResponsiveTable.svelte';
	import { formatDate } from '$lib/format';
	import type { PageData } from './$types';

	type Props = { data: PageData };
	let { data }: Props = $props();

	type ApiKey = PageData['domains'][number];
	let selection = $state<ApiKey[]>([]);
</script>

<h1>Domains</h1>

<Form method="post" action="?/add" class="flex flex-col gap-4">
	{#snippet children({ loading })}
		<label>
			<input type="text" name="name" />
		</label>

		<Button {loading}>Create API Key</Button>
	{/snippet}
</Form>

<ResponsiveTable data={data.domains} bind:selection>
	{#snippet header()}
		<th>Name</th>
		<th>Status</th>
		<th>CreatedAt</th>
		<th></th>
	{/snippet}

	{#snippet row(domain)}
		<td>{domain.name}</td>
		<td>{domain.status}</td>
		<td>{formatDate(domain.createdAt)}</td>
		<td>
			<Form method="post" action="?/remove">
				{#snippet children({ loading })}
					<input type="hidden" name="apiKeyId" value={domain.id} />
					<Button {loading}>Remove</Button>
				{/snippet}
			</Form>
		</td>
	{/snippet}
</ResponsiveTable>
