<script>
	import Image from '../components/Image.svelte';
	import { page } from '$app/stores';
</script>

<h1 class="text-3xl font-bold underline">
	{$page.status}: {$page?.error?.message ?? 'Unknown error'}
</h1>

<Image src="404" />
