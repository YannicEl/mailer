<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import FormError from '$lib/components/FormError.svelte';
	import Form from '$lib/components/forms/Form.svelte';
	import type { ActionData } from './$types';

	type Props = {
		form: ActionData;
	};
	const { form }: Props = $props();
</script>

<Form class="flex flex-1 flex-col gap-4">
	{#snippet children({ loading })}
		<label>
			Email:
			<input type="text" name="email" autocomplete="email" required />
		</label>

		<div class="flex flex-col items-center gap-1">
			<Button class="w-full" {loading}>Sign in</Button>

			<a href="signup">Don't have an account? <span class="underline">Sign up.</span></a>
		</div>
	{/snippet}
</Form>

{#if form?.error}
	<FormError error={form.error} />
{/if}
