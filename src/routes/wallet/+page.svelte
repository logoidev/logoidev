<script lang="ts">
	import { onMount } from 'svelte';
	import { generateMnemonic, mnemonicToAccount, type Account } from 'viem/accounts';
	import {
		createWalletClient,
		createPublicClient,
		http,
		isAddress,
		formatEther,
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
	let amount = '1'; // Default to 1 wei
	let txHash = '';
	let isSending = false;
	let error = '';
	let storageError = '';
	let balance = '0';
	let hasWallet = false;
	let estimatedGasFee = '0';
	let contacts: { name: string; address: string }[] = [];
	let newContactName = '';
	let newContactAddress = '';
	let showAddContact = false;
	let hasEnoughFunds = true;

	const MIN_AMOUNT = '1'; // 1 wei

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

	function loadContacts() {
		try {
			const savedContacts = localStorage.getItem('wallet_contacts');
			if (savedContacts) {
				contacts = JSON.parse(savedContacts);
			}
		} catch (e) {
			console.warn('Error loading contacts:', e);
		}
	}

	function saveContacts() {
		try {
			localStorage.setItem('wallet_contacts', JSON.stringify(contacts));
		} catch (e) {
			console.warn('Error saving contacts:', e);
		}
	}

	function addContact() {
		if (!newContactName || !newContactAddress) {
			error = 'Please fill in both name and address';
			return;
		}

		if (!isAddress(newContactAddress)) {
			error = 'Invalid Ethereum address';
			return;
		}

		contacts = [...contacts, { name: newContactName, address: newContactAddress }];
		saveContacts();
		newContactName = '';
		newContactAddress = '';
		showAddContact = false;
	}

	function removeContact(index: number) {
		contacts = contacts.filter((_, i) => i !== index);
		saveContacts();
	}

	function selectContact(contact: { name: string; address: string }) {
		recipientAddress = contact.address;
	}

	async function updateBalance() {
		if (!hasWallet) return;

		try {
			const bal = await publicClient.getBalance({ address: address as `0x${string}` });
			balance = bal.toString();
			// Re-estimate gas fee after balance update
			await estimateGasFee();
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
		}) as PublicClient;

		saveToStorage('wallet_mnemonic', mnemonic);
		saveToStorage('wallet_address', address);
		hasWallet = true;

		console.log('Wallet created:', address);
		await updateBalance();
	}

	function clearWallet() {
		mnemonic = '';
		address = '';
		balance = '0';
		hasWallet = false;
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
				}) as WalletClient;
				publicClient = createPublicClient({
					chain: optimismSepolia,
					transport: http()
				}) as PublicClient;
				hasWallet = true;
				console.log('Wallet loaded from storage:', address);
				await updateBalance();
			} else {
				await initializeWallet();
			}

			loadContacts();
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

		if (BigInt(amount) < BigInt(MIN_AMOUNT)) {
			error = `Amount must be at least ${MIN_AMOUNT} wei`;
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
				value: BigInt(amount)
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

	async function estimateGasFee() {
		if (!recipientAddress || !amount || !hasWallet) {
			estimatedGasFee = '0';
			hasEnoughFunds = true;
			return;
		}

		try {
			const gasEstimate = await publicClient.estimateGas({
				account: address as `0x${string}`,
				to: recipientAddress as `0x${string}`,
				value: BigInt(amount)
			});

			const gasPrice = await publicClient.getGasPrice();
			const fee = gasEstimate * gasPrice;
			estimatedGasFee = fee.toString();

			// Check if we have enough funds for the transaction
			const totalCost = fee + BigInt(amount);
			hasEnoughFunds = BigInt(balance) >= totalCost;

			if (!hasEnoughFunds) {
				error = `Insufficient funds. You need ${formatEther(totalCost)} ETH (${totalCost} wei) for this transaction.`;
			} else {
				error = '';
			}
		} catch (e: any) {
			console.error('Error estimating gas:', e);
			estimatedGasFee = '0';

			// Check if it's an insufficient funds error
			if (e.message?.includes('insufficient funds')) {
				hasEnoughFunds = false;
				const totalCost = BigInt(amount);
				error = `Insufficient funds. You need at least ${formatEther(totalCost)} ETH (${totalCost} wei) for this transaction.`;
			} else {
				hasEnoughFunds = true;
				error = 'Error estimating gas fee. Please try again.';
			}
		}
	}

	$: if (recipientAddress && amount) {
		estimateGasFee();
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
		<div class="mb-2 flex items-center gap-2">
			<strong>Mnemonic:</strong>
			<span class="font-mono">{mnemonic}</span>
		</div>
		<div class="mb-2 flex items-center gap-2">
			<strong>Address:</strong>

			<button
				id="copy-address"
				class="text-xs text-blue-600 relative hover:text-blue-700 font-mono bg-gray-100 px-2 py-1 rounded border border-gray-300 min-w-[200px] text-center"
				on:click={function () {
					// Important to be a function declaration, not an arrow function, so that `this` is bound to the button element
					navigator.clipboard.writeText(address);

					// @ts-ignore
					const addressElement = this.children[0];
					// @ts-ignore
					const copiedIndicatorElement = this.children[1];

					addressElement.classList.add('invisible');
					copiedIndicatorElement.classList.remove('invisible');

					console.dir(this);

					setTimeout(() => {
						addressElement.textContent = address;
						addressElement.classList.remove('invisible');
						copiedIndicatorElement.classList.add('invisible');
					}, 2000);
				}}
			>
				<div class="w-full h-full flex items-center justify-center">{address}</div>
				<div class="invisible absolute top-0 left-0 w-full h-full flex items-center justify-center">
					Copied
				</div>
			</button>
		</div>
		<p class="mb-2">
			<strong>Balance:</strong>
			{balance} wei ({formatEther(BigInt(balance))} ETH)
		</p>
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
				disabled={!hasWallet}
				class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
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

		<div class="mb-4">
			<div class="flex justify-between items-center mb-2">
				<h3 class="text-lg font-medium">Saved Recipients</h3>
				<button
					on:click={() => (showAddContact = !showAddContact)}
					class="text-sm text-blue-600 hover:text-blue-700"
				>
					{showAddContact ? 'Cancel' : '+ Add New Contact'}
				</button>
			</div>

			{#if showAddContact}
				<div class="p-4 bg-gray-50 rounded-lg mb-4">
					<div class="space-y-3">
						<div>
							<label for="contactName" class="block text-sm font-medium text-gray-700 mb-1"
								>Contact Name</label
							>
							<input
								type="text"
								id="contactName"
								bind:value={newContactName}
								class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
								placeholder="Enter name"
							/>
						</div>
						<div>
							<label for="contactAddress" class="block text-sm font-medium text-gray-700 mb-1"
								>Ethereum Address</label
							>
							<input
								type="text"
								id="contactAddress"
								bind:value={newContactAddress}
								class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
								placeholder="0x..."
							/>
						</div>
						<button
							on:click={addContact}
							class="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
						>
							Save Contact
						</button>
					</div>
				</div>
			{/if}

			{#if contacts.length > 0}
				<div class="space-y-2">
					{#each contacts as contact, i}
						<div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
							<button
								on:click={() => selectContact(contact)}
								class="flex-1 text-left hover:bg-gray-100 p-2 rounded"
							>
								<p class="font-medium">{contact.name}</p>
								<p class="text-sm text-gray-600 break-all">
									{contact.address.slice(0, 4)}...{contact.address.slice(-4)}
								</p>
							</button>
							<button
								on:click={() => removeContact(i)}
								class="ml-2 text-red-600 hover:text-red-700 p-2"
							>
								×
							</button>
						</div>
					{/each}
				</div>
			{:else}
				<p class="text-gray-500 text-sm italic">No saved recipients yet</p>
			{/if}
		</div>

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
				<label for="amount" class="block text-sm font-medium text-gray-700 mb-1">Amount (wei)</label
				>
				<input
					type="number"
					id="amount"
					bind:value={amount}
					min={MIN_AMOUNT}
					class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
					placeholder="1"
				/>
				<p class="mt-1 text-sm text-gray-500">
					Minimum amount: {MIN_AMOUNT} wei ({formatEther(BigInt(MIN_AMOUNT))} ETH)
				</p>
			</div>

			{#if estimatedGasFee !== '0'}
				<div class="p-3 bg-gray-50 rounded-md">
					<p class="text-sm text-gray-700">
						Estimated gas fee: {formatEther(BigInt(estimatedGasFee))} ETH ({estimatedGasFee} wei)
					</p>
					<p class="text-xs text-gray-500 mt-1">
						Note: Gas fees on Optimism are much lower than on Ethereum mainnet
					</p>
				</div>
			{/if}

			{#if error}
				<div
					class="p-3 {hasEnoughFunds
						? 'bg-yellow-50 text-yellow-800'
						: 'bg-red-50 text-red-800'} rounded-md"
				>
					<p class="text-sm">{error}</p>
					{#if !hasEnoughFunds}
						<p class="text-sm mt-1">
							Your balance: {formatEther(BigInt(balance))} ETH ({balance} wei)
						</p>
					{/if}
				</div>
			{/if}

			<button
				type="submit"
				disabled={isSending || !hasWallet || !hasEnoughFunds}
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
