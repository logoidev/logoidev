<script lang="ts">
	import IconLink from './IconLink.svelte';

	export let url: string;
	export let title = 'Map';
</script>

<IconLink {title} text={title} href={url} iconName="pin" scale={1.2} class="mt-0" />
