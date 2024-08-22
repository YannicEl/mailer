<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import Form from '$lib/components/forms/Form.svelte';
	import ResponsiveTable from '$lib/components/ResponsiveTable.svelte';
	import { formatDate } from '$lib/format';
	import type { PageData } from './$types';
</script>

<h1>Add Domain</h1>

<Form method="post" class="flex flex-col gap-4">
	{#snippet children({ loading })}
		<label>
			<input type="text" name="name" />
		</label>

		<Button {loading}>Add domain</Button>
	{/snippet}
</Form>
