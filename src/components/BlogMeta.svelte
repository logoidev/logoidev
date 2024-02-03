<script lang="ts">
	import { ORIGIN } from 'src/shared/constants';

	export let title: string = '';
	export let type: 'website' | 'article' = 'website';
	export let url = `${ORIGIN}/blog`;
	export let previewImageUrl = '/images/blog.svg';
	$: fullTitle = title ? `${title} - Logoi Blog` : 'Logoi - Blog';
</script>

<svelte:head>
	<title>{fullTitle}</title>
	<meta
		name="description"
		content="Logoi Development is a digital design collective on the edge of liberal arts, philosophy and most advanced digital technology"
	/>
	<meta property="og:title" content={fullTitle} />
	<meta property="og:type" content={type} />
	<meta property="og:url" content={url} />
	{#if previewImageUrl}
		<meta property="og:image" content={previewImageUrl} />
	{/if}
</svelte:head>
