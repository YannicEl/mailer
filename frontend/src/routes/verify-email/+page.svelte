<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData, PageData } from './$types';

	type Props = { data: PageData; form: ActionData };
	const { data, form }: Props = $props();

	console.log(data);
</script>

<form method="post" use:enhance class="flex flex-col">
	<label>
		Email:
		<input type="text" name="email" bind:value={data.email} />
	</label>

	<label>
		Code:
		<input type="text" name="verificationCode" />
	</label>

	<button>Verify</button>
</form>
