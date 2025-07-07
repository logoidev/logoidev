<script lang="ts">
	import ChatMessage, { type Message } from './ChatMessage.svelte';

	export let name: string;
	export let messages: Message[];
</script>

<h3 class="text-xl text-center my-4 font-semibold">{name}</h3>
<div class="border-gray-100 rounded border max-w-3xl mx-auto">
	{#each messages as message}
		<ChatMessage {message} />
	{/each}
</div>

<style lang="postcss">
	:global(.message-md strong) {
		font-weight: 600 !important;
	}
</style>
