<script>
	import IconLink from './IconLink.svelte';

	const GOOGLE_MAPS_URL = 'https://goo.gl/maps/H6f9J869J49DB83XA';

	export let url = GOOGLE_MAPS_URL;
	export let title = 'Map';
</script>

<IconLink {title} text={title} href={url} iconName="pin" scale={1.2} class="mt-0" />
