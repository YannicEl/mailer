<script lang="ts">
	import { enhance } from '$app/forms';
</script>

<form method="post" use:enhance class="flex flex-col">
	<label>
		Email
		<input type="text" name="email" />
	</label>

	<button>Login</button>
</form>
