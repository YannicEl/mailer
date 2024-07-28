<script lang="ts">
	import type { PageData } from './$types';

	type Props = { data: PageData };
	const { data }: Props = $props();

	console.log(data);
</script>

<form>
	<label>
		Email
		<input type="text" name="email" />
	</label>

	<button>Login</button>
</form>
