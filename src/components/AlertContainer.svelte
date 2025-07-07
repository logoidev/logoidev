<script lang="ts">
	import { alerts } from '$lib/stores/alert';
	import Alert from './Alert.svelte';
</script>

<div class="fixed top-4 right-4 z-50 space-y-2">
	{#each $alerts as alert (alert.id)}
		<Alert
			type={alert.type}
			title={alert.title}
			message={alert.message}
			duration={alert.duration}
			dismissible={alert.dismissible}
			show={true}
			on:dismiss={() => alerts.remove(alert.id)}
		/>
	{/each}
</div>
