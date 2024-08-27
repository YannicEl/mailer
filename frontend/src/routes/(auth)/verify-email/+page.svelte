<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import FormError from '$lib/components/FormError.svelte';
	import Form from '$lib/components/forms/Form.svelte';
	import type { ActionData, PageData } from './$types';

	type Props = { data: PageData; form: ActionData };
	const { data, form }: Props = $props();
</script>

<Form class="flex flex-col gap-4">
	{#snippet children({ loading })}
		<label>
			Email:
			<input type="email" name="email" value={data.email} />
		</label>

		<label>
			Code:
			<input type="text" name="verificationCode" />
		</label>

		<Button class="w-full" {loading}>Verify</Button>
	{/snippet}
</Form>

{#if form?.error}
	<FormError error={form.error} />
{/if}
