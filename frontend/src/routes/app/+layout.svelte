<script lang="ts">
	import { enhance } from '$app/forms';
</script>

<header>
	<form method="post" action="/api/auth?/signout" use:enhance>
		<button>sign out</button>
	</form>
</header>

<slot />
