<script lang="ts">
	import type { FormError } from '$lib/types';
	import Alert from './Alert.svelte';

	type Props = {
		error: FormError;
	};
	const { error }: Props = $props();
</script>

<Alert type="error" title={error.title}>
	{error.message}
</Alert>
