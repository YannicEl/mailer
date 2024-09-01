<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import Form from '$lib/components/forms/Form.svelte';
	import ResponsiveTable from '$lib/components/ResponsiveTable.svelte';
	import { formatDate } from '$lib/format';
	import type { PageData } from './$types';

	type Props = { data: PageData };
	let { data }: Props = $props();

	type ApiKey = PageData['apiKeys'][number];
	let selection = $state<ApiKey[]>([]);
</script>

<h1>Api Keys</h1>

<Form action="?/add" class="flex flex-col gap-4">
	{#snippet children({ loading })}
		<label>
			<input type="text" name="name" />
		</label>

		<Button {loading}>Create API Key</Button>
	{/snippet}
</Form>

<ResponsiveTable data={data.apiKeys} bind:selection>
	{#snippet header()}
		<th>Name</th>
		<th>Key</th>
		<th>CreatedAt</th>
		<th></th>
	{/snippet}

	{#snippet row(apiKey)}
		<td>{apiKey.name}</td>
		<td>{apiKey.key}</td>
		<td>{formatDate(apiKey.createdAt)}</td>
		<td>
			<Form action="?/remove">
				{#snippet children({ loading })}
					<input type="hidden" name="apiKeyId" value={apiKey.id} />
					<Button {loading}>Remove</Button>
				{/snippet}
			</Form>
		</td>
	{/snippet}
</ResponsiveTable>
