<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';
	import { fade, fly } from 'svelte/transition';
	import { cn } from '$lib/utility/cn';

	const dispatch = createEventDispatcher();

	export let type: 'success' | 'error' | 'warning' | 'info' = 'info';
	export let title: string = '';
	export let message: string = '';
	export let duration: number = 5000; // Auto-dismiss after 5 seconds
	export let dismissible: boolean = true;
	export let show: boolean = false;

	let timeoutId: number;

	const icons = {
		success: '✅',
		error: '❌',
		warning: '⚠️',
		info: 'ℹ️'
	};

	const colors = {
		success: 'bg-green-50 border-green-200 text-green-800',
		error: 'bg-red-50 border-red-200 text-red-800',
		warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
		info: 'bg-blue-50 border-blue-200 text-blue-800'
	};

	function dismiss() {
		show = false;
		dispatch('dismiss');
	}

	function handleDismiss() {
		if (dismissible) {
			dismiss();
		}
	}

	onMount(() => {
		if (duration > 0) {
			timeoutId = window.setTimeout(() => {
				dismiss();
			}, duration);
		}

		return () => {
			if (timeoutId) {
				clearTimeout(timeoutId);
			}
		};
	});

	$: if (!show && timeoutId) {
		clearTimeout(timeoutId);
	}
</script>

{#if show}
	<div
		class={cn(
			'fixed top-4 right-4 z-50 max-w-sm w-full p-4 rounded-lg border shadow-lg transition-all duration-300',
			colors[type]
		)}
		transition:fly={{ y: -50, duration: 300 }}
		role="alert"
		aria-live="assertive"
	>
		<div class="flex items-start gap-3">
			<div class="flex-shrink-0 text-lg">{icons[type]}</div>
			<div class="flex-1 min-w-0">
				{#if title}
					<h4 class="font-semibold text-sm mb-1">{title}</h4>
				{/if}
				{#if message}
					<p class="text-sm leading-relaxed">{message}</p>
				{/if}
			</div>
			{#if dismissible}
				<button
					on:click={handleDismiss}
					class="flex-shrink-0 ml-2 text-lg hover:opacity-70 transition-opacity focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-current rounded"
					aria-label="Dismiss alert"
				>
					×
				</button>
			{/if}
		</div>
	</div>
{/if}
