<script lang="ts">
	import { onMount } from 'svelte';
	import { generateMnemonic, mnemonicToAccount, type Account } from 'viem/accounts';
	import {
		createWalletClient,
		createPublicClient,
		http,
		parseEther,
		isAddress,
		type WalletClient,
		type PublicClient
	} from 'viem';
	import { optimismSepolia } from 'viem/chains';
	import { wordlist } from '@scure/bip39/wordlists/english';

	let mnemonic = '';
	let address = '';
	let client: WalletClient;
	let publicClient: PublicClient;
	let account: Account;
	let recipientAddress = '';
	let amount = '';
	let txHash = '';
	let isSending = false;
	let error = '';
	let storageError = '';
	let balance = '0';

	function saveToStorage(key: string, value: string) {
		try {
			localStorage.setItem(key, value);
		} catch (e) {
			storageError = 'Local storage is not available. Wallet will not persist.';
			console.warn('Storage error:', e);
		}
	}

	function removeFromStorage(key: string) {
		try {
			localStorage.removeItem(key);
		} catch (e) {
			console.warn('Storage error:', e);
		}
	}

	async function updateBalance() {
		try {
			const bal = await publicClient.getBalance({ address: address as `0x${string}` });
			balance = (Number(bal) / 1e18).toFixed(4);
		} catch (e) {
			console.error('Error fetching balance:', e);
		}
	}

	async function initializeWallet() {
		mnemonic = generateMnemonic(wordlist);
		account = await mnemonicToAccount(mnemonic);
		address = account.address;

		client = createWalletClient({
			account,
			chain: optimismSepolia,
			transport: http()
		});

		publicClient = createPublicClient({
			chain: optimismSepolia,
			transport: http()
		});

		saveToStorage('wallet_mnemonic', mnemonic);
		saveToStorage('wallet_address', address);

		console.log('Wallet created:', address);
		await updateBalance();
	}

	function clearWallet() {
		mnemonic = '';
		address = '';
		balance = '0';
		removeFromStorage('wallet_mnemonic');
		removeFromStorage('wallet_address');
	}

	onMount(async () => {
		try {
			// Try to load from localStorage
			const savedMnemonic = localStorage.getItem('wallet_mnemonic');
			const savedAddress = localStorage.getItem('wallet_address');

			if (savedMnemonic && savedAddress) {
				mnemonic = savedMnemonic;
				address = savedAddress;
				account = await mnemonicToAccount(mnemonic);
				client = createWalletClient({
					account,
					chain: optimismSepolia,
					transport: http()
				});
				publicClient = createPublicClient({
					chain: optimismSepolia,
					transport: http()
				});
				console.log('Wallet loaded from storage:', address);
				await updateBalance();
			} else {
				await initializeWallet();
			}
		} catch (e) {
			console.error('Error loading wallet:', e);
			await initializeWallet();
		}
	});

	async function sendTransaction() {
		if (!recipientAddress || !amount) {
			error = 'Please fill in all fields';
			return;
		}

		if (!isAddress(recipientAddress)) {
			error = 'Invalid recipient address';
			return;
		}

		try {
			isSending = true;
			error = '';

			console.log('Sending transaction:', {
				from: address,
				to: recipientAddress,
				value: amount,
				chain: optimismSepolia.id
			});

			const hash = await client.sendTransaction({
				account,
				chain: optimismSepolia,
				to: recipientAddress as `0x${string}`,
				value: parseEther(amount)
			});

			txHash = hash;
			console.log('Transaction sent:', hash);
			await updateBalance();
		} catch (e: any) {
			error = e.message;
			console.error('Transaction failed:', e);
		} finally {
			isSending = false;
		}
	}
</script>

<main class="p-4 font-sans max-w-2xl mx-auto">
	<h1 class="text-2xl font-bold mb-4">🦊 Optimism Wallet (Testnet)</h1>

	{#if storageError}
		<div class="mb-4 p-4 bg-yellow-50 text-yellow-800 rounded-lg">
			{storageError}
		</div>
	{/if}

	<div class="mb-6 p-4 bg-gray-50 rounded-lg">
		<p class="mb-2"><strong>Mnemonic:</strong> {mnemonic}</p>
		<p class="mb-2"><strong>Address:</strong> {address}</p>
		<p class="mb-2"><strong>Balance:</strong> {balance} ETH</p>
		<p class="text-sm text-gray-600 italic mb-4">
			This wallet is stored in your browser's local storage.
		</p>
		<div class="flex gap-2">
			<button
				on:click={clearWallet}
				class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
			>
				Clear Wallet
			</button>
			<button
				on:click={initializeWallet}
				class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
			>
				Generate New Wallet
			</button>
			<button
				on:click={updateBalance}
				class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
			>
				Refresh Balance
			</button>
		</div>
	</div>

	<div class="mb-6">
		<h2 class="text-xl font-semibold mb-4">Send Transaction</h2>
		<p class="text-sm text-gray-600 mb-4">
			Get testnet ETH from the <a
				href="https://sepoliafaucet.com/"
				target="_blank"
				rel="noopener noreferrer"
				class="text-blue-600 hover:underline">Sepolia Faucet</a
			>
		</p>

		<form on:submit|preventDefault={sendTransaction} class="space-y-4">
			<div>
				<label for="recipient" class="block text-sm font-medium text-gray-700 mb-1"
					>Recipient Address</label
				>
				<input
					type="text"
					id="recipient"
					bind:value={recipientAddress}
					class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
					placeholder="0x..."
				/>
			</div>

			<div>
				<label for="amount" class="block text-sm font-medium text-gray-700 mb-1">Amount (ETH)</label
				>
				<input
					type="number"
					id="amount"
					bind:value={amount}
					step="0.000000000000000001"
					class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
					placeholder="0.0"
				/>
			</div>

			{#if error}
				<p class="text-red-600 text-sm">{error}</p>
			{/if}

			<button
				type="submit"
				disabled={isSending}
				class="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
			>
				{isSending ? 'Sending...' : 'Send Transaction'}
			</button>
		</form>
	</div>

	{#if txHash}
		<div class="p-4 bg-green-50 rounded-lg">
			<p class="text-green-800">
				Transaction sent! Hash:
				<a
					href="https://sepolia-optimism.etherscan.io/tx/{txHash}"
					target="_blank"
					rel="noopener noreferrer"
					class="text-blue-600 hover:underline break-all"
				>
					{txHash}
				</a>
			</p>
		</div>
	{/if}
</main>
