<script lang="ts">
	import { page } from '$app/stores';
	import Icon from './Icon.svelte';
	import Logo from './Logo.svelte';

	import type { SvelteHTMLElements } from 'svelte/elements';

	type Props = {} & SvelteHTMLElements['aside'];
	let { ...props }: Props = $props();

	const routes = [
		{
			path: 'emails',
			name: 'Emails',
			icon: 'i-mdi-email',
		},
		{
			path: 'domains',
			name: 'Domains',
			icon: 'i-mdi-earth',
		},
		{
			path: 'keys',
			name: 'Api keys',
			icon: 'i-mdi-key',
		},
	];
</script>

<aside {...props}>
	<div>
		<Logo class="mb-6 h-8" />

		<nav>
			<ul class="flex flex-col gap-2">
				{#each routes as route}
					<li>
						<a
							class:active={$page.url.pathname === `/app/${route.path}`}
							href={route.path}
							class="flex items-center gap-2 rounded-sm p-1 px-2"
						>
							<Icon icon={route.icon} />
							{route.name}
						</a>
					</li>
				{/each}
			</ul>
		</nav>
	</div>

	<a href="api/auth/signout">sign out</a>
</aside>

<style>
	aside {
		--apply: flex flex-col justify-between;
	}

	a:hover {
		--apply: bg-gray-1;
	}

	a.active {
		--apply: bg-gray-1;
	}
</style>
