<script lang="ts">
	import { enhance } from '$app/forms';
	import Button from '$lib/components/Button.svelte';
	import FormError from '$lib/components/FormError.svelte';
	import type { ActionData, SubmitFunction } from './$types';

	type Props = {
		form: ActionData;
	};
	const { form }: Props = $props();

	let loading = $state(false);

	const submit: SubmitFunction = () => {
		loading = true;

		return ({ update }) => {
			loading = false;

			update();
		};
	};
</script>

<form method="post" use:enhance={submit} class="flex flex-1 flex-col gap-4">
	<label>
		Email:
		<input type="text" name="email" autocomplete="email" required />
	</label>

	<div class="flex flex-col items-center gap-1">
		<Button {loading}>Sign in</Button>

		<a href="signup">Don't have an account? <span class="underline">Sign up.</span></a>
	</div>
</form>

{#if form?.error}
	<FormError error={form.error} />
{/if}
