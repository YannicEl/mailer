<script lang="ts">
	import { enhance } from '$app/forms';
	import ResponsiveTable from '$lib/components/ResponsiveTable.svelte';
	import type { PageData } from './$types';

	type Props = { data: PageData };
	let { data }: Props = $props();

	type ApiKey = PageData['apiKeys'][number];
	let selection = $state<ApiKey[]>([]);

	function doSomething(apiKey: ApiKey): void {
		console.log(apiKey);
	}
</script>

<h1>Api Keys</h1>

<form method="post" use:enhance class="flex flex-col gap-4">
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
		<td>{apiKey.createdAt}</td>
		<td>
			<button onclick={() => doSomething(apiKey)}>...</button>
		</td>
	{/snippet}
</ResponsiveTable>
