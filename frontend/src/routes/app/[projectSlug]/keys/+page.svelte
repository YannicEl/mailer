<script lang="ts">
	import { enhance } from '$app/forms';
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

<form method="post" action="?/add" use:enhance class="flex flex-col gap-4">
	<label>
		<input type="text" name="name" />
	</label>

	<button>Create API Key</button>
</form>

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
			<Form method="post" action="?/remove">
				{#snippet children({ loading })}
					<input type="hidden" name="apiKeyId" value={apiKey.id} />
					<Button {loading}>Remove</Button>
				{/snippet}
			</Form>
		</td>
	{/snippet}
</ResponsiveTable>
