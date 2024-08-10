<script lang="ts">
	import { enhance } from '$app/forms';
	import ResponsiveTable from '$lib/components/ResponsiveTable.svelte';
	import type { PageData } from './$types';

	type Props = { data: PageData };
	let { data }: Props = $props();
</script>

<h1>Api Keys</h1>

<form method="post" use:enhance class="flex flex-col gap-4">
	<label>
		<input type="text" name="name" />
	</label>

	<button>Create API Key</button>
</form>

<ResponsiveTable data={data.apiKeys}>
	{#snippet header()}
		<th>Name</th>
		<th>Key</th>
		<th>CreatedAt</th>
	{/snippet}

	{#snippet row({ name, key, createdAt })}
		<td>{name}</td>
		<td>{key}</td>
		<td>{createdAt}</td>
	{/snippet}
</ResponsiveTable>
