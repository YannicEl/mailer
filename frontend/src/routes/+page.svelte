<script lang="ts">
	import type { PageData } from './$types';

	type Props = { data: PageData };
	let { data }: Props = $props();
</script>

<div>Logged in user: {data.user?.email}</div>

<div>DB Users</div>

<table>
	<thead>
		<tr>
			<th>Id</th>
			<th>CreatedAt</th>
			<th>UpdatedAt</th>
		</tr>
	</thead>

	<tbody>
		{#each data.users as user}
			<tr>
				<td>{user.id}</td>
				<td>{user.createdAt}</td>
				<td>{user.updatedAt}</td>
			</tr>
		{/each}
	</tbody>
</table>
