<script lang="ts">
	import type { UserIds } from '../types/user';
	import IconLink from './IconLink.svelte';

	export let id: UserIds;
</script>

<IconLink iconName="file" title="View full resume" href={`/resumes/${id}.pdf`} />
