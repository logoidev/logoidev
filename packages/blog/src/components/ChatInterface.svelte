<script lang="ts">
	import { onMount } from 'svelte';
	import { sendMessage } from '../utils/apiClient';
	import { USERS } from 'src/data/users';
	import NameAvatar from './NameAvatar.svelte';

	const BOT_NAME = 'Adam';
	const SENDER_NAME = 'You';
	const MESSAGE_HISTORY_KEY = 'adam-chat-history';
	const MESSAGE_LIMIT_KEY = 'adam-chat-limit';
	const DEFAULT_CHAT_LIMIT = 20;

	const USER_ADAM = USERS.find((u) => u.id === 'ai')!;

	type Message = { id: number; sender: string; message: string };
	type ChatHistory = Message[];

	let userInput = '';
	let chatHistory: ChatHistory = [];

	export let chatLimit = DEFAULT_CHAT_LIMIT;

	$: isLimitReached = chatHistory.length >= chatLimit;

	$: {
		if (chatLimit && chatLimit !== DEFAULT_CHAT_LIMIT) {
			localStorage.setItem(MESSAGE_LIMIT_KEY, chatLimit.toString());
		}
	}

	onMount(() => {
		const savedHistory = localStorage.getItem(MESSAGE_HISTORY_KEY);
		if (savedHistory) {
			chatHistory = JSON.parse(savedHistory);
		}

		const savedLimit = localStorage.getItem(MESSAGE_LIMIT_KEY);
		if (savedLimit) {
			chatLimit = Number(savedLimit);
		}
	});

	function persistChatHistory(history: ChatHistory) {
		localStorage.setItem(MESSAGE_HISTORY_KEY, JSON.stringify(history));
	}

	async function handleSend() {
		if (isLimitReached) {
			return;
		}

		if (!userInput.trim()) {
			return;
		}

		let message = userInput;
		chatHistory = [...chatHistory, { sender: SENDER_NAME, message, id: chatHistory.length + 1 }];
		persistChatHistory(chatHistory);
		userInput = '';

		let botMessage = '';
		const responseId = chatHistory.length + 2;
		await sendMessage(message, (chunk) => {
			botMessage += chunk;
			chatHistory = [
				...chatHistory.filter((msg) => msg.id !== responseId),
				{ id: responseId, sender: BOT_NAME, message: botMessage }
			];
			persistChatHistory(chatHistory);
		});
	}
</script>

<div class="mx-auto w-full h-full bg-white overflow-hidden font-sans">
	<div
		class="px-6 py-4 h-[calc(100svh-17.5rem)] overflow-y-auto"
		class:h-[calc(100svh-21rem)]={isLimitReached}
	>
		{#if chatHistory.length}
			{#each chatHistory as { sender, message }}
				<div class="mb-4">
					<strong class="text-gray-700">{sender}:</strong>
					<p class="text-gray-600">{message}</p>
				</div>
			{/each}
		{:else}
			<div class="flex flex-col justify-center items-center">
				<NameAvatar userData={USER_ADAM} noLastName noFirstName />
				<p>
					<button
						class="underline"
						on:click={() => {
							userInput = 'Hi, Adam!';
							handleSend();
						}}
					>
						Say hi
					</button> to Adam 👋
				</p>
			</div>
		{/if}
	</div>
	{#if isLimitReached}
		<div class="p-4">
			Limit of {chatLimit} is reached. Please speak to
			<a href="/v" target="_blank" class="underline">Vlad</a>
		</div>
	{/if}
	<div class="bottom-0 left-0 right-0 p-4 border-t flex flex-col justify-between">
		<input
			type="text"
			bind:value={userInput}
			placeholder="Type a message..."
			class="w-full px-3 py-2 mb-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
			on:keydown={(e) => e.key === 'Enter' && handleSend()}
		/>
		<button
			on:click={handleSend}
			disabled={!userInput.length || isLimitReached}
			class="w-full disabled:bg-gray-500 disabled:cursor-not-allowed bg-black text-white py-2 rounded hover:bg-gray-500"
		>
			Send
		</button>
	</div>
</div>
