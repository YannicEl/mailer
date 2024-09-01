<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import Form from '$lib/components/forms/Form.svelte';
</script>

<h1>Add Domain</h1>

<Form class="flex flex-col gap-4">
	{#snippet children({ loading })}
		<label>
			<input type="text" name="name" />
		</label>

		<Button {loading}>Add domain</Button>
	{/snippet}
</Form>
