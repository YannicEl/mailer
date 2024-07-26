<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';

	type Props = { form: ActionData };
	const { form }: Props = $props();
</script>

<form method="post" use:enhance class="flex flex-col">
	<label>
		Email:
		<input type="text" name="email" />
	</label>

  <label>
		Code:
		<input type="text" name="email" />
	</label>

	<button>Verify</button>
</form>
