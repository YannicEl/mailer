<script lang="ts">
	import type { PageData } from './$types';

	type Props = { data: PageData };
	let { data }: Props = $props();

	console.log(data);
</script>

<div>Logged in user: {data.user?.email}</div>
