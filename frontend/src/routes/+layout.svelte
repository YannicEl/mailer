<script lang="ts">
	import '@unocss/reset/tailwind.css';
	import 'virtual:uno.css';
	import '../main.css';
	import { PUBLIC_FRONTEND_URL } from '$env/static/public';
</script>

{process.env.PUBLIC_FRONTEND_URL}
{PUBLIC_FRONTEND_URL}

<slot />
