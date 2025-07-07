<script lang="ts">
	import { cn } from 'src/lib/utility/cn';
	import { createEventDispatcher } from 'svelte';
	import { onMount } from 'svelte';

	const dispatch = createEventDispatcher();

	export let value = '';
	export let displayValue: string | undefined = undefined;
	export let placeholder = '';
	export let disabled = false;
	export let multiline = false;
	export let label = '';
	export let id = '';
	export let editable = false;

	let isEditing = false;
	let inputElement: HTMLInputElement | HTMLTextAreaElement;
	let originalValue = '';

	function startEditing() {
		if (disabled || !editable) return;
		isEditing = true;
		originalValue = value;
		setTimeout(() => {
			if (inputElement) {
				inputElement.focus();
				inputElement.select();
			}
		}, 0);
	}

	function stopEditing() {
		isEditing = false;
		if (value !== originalValue) {
			dispatch('change', { value, originalValue });
		}
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			value = originalValue;
			stopEditing();
		} else if (event.key === 'Enter' && !multiline) {
			event.preventDefault();
			stopEditing();
		}
	}

	function handleBlur() {
		stopEditing();
	}

	function handleKeydownDiv(event: KeyboardEvent) {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			startEditing();
		}
	}

	onMount(() => {
		originalValue = value;
	});
</script>

{#if label}
	<label for={id} class="inline-block text-sm font-medium text-gray-700 mb-1">{label}</label>
{/if}

{#if editable && isEditing}
	{#if multiline}
		<textarea
			bind:this={inputElement}
			bind:value
			{placeholder}
			{disabled}
			on:keydown={handleKeydown}
			on:blur={handleBlur}
			rows="3"
			class="w-full px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed {$$props.class}"
		/>
	{:else}
		<input
			bind:this={inputElement}
			bind:value
			{placeholder}
			{disabled}
			on:keydown={handleKeydown}
			on:blur={handleBlur}
			class="w-full px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed {$$props.class}"
		/>
	{/if}
{:else}
	<div
		on:click={startEditing}
		on:keydown={handleKeydownDiv}
		tabindex="0"
		role="button"
		aria-label="Click to edit"
		class={cn(
			'min-h-[2.5rem] px-2 py-1 border border-transparent rounded cursor-pointer transition-colors',
			{
				'opacity-50 cursor-not-allowed': disabled,
				'cursor-default': !editable,
				'hover:bg-gray-50 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500':
					editable
			},
			$$props.class
		)}
	>
		{#if value}
			{#if multiline}
				<div class="whitespace-pre-wrap inline">{value}</div>
			{:else}
				{displayValue ?? value}
			{/if}
		{:else}
			<span class="text-gray-400 italic">{placeholder}</span>
		{/if}
	</div>
{/if}
