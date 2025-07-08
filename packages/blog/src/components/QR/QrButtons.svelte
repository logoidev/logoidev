<script lang="ts">
	import { noop } from 'src/utils/lodash';
	import QrButton from './QrButton.svelte';
	import { QrState, QrPosition, QrPositionToNumber, type QrPassword } from './QrButtons.types';

	export let onUnlock = noop;
	export let onError = noop;
	export let onLocked = noop;
	export let password: QrPassword = [];
	export let sizeCss = '';
	export let rounded = false;
	export let animated = false;

	const MAX_FAILS_AMOUNT = 2;

	let state: QrState = QrState.UNTOUCHED;

	let currentPassword: QrPassword = [];
	let numberOfFails = 0;

	const areSamePasswords = (p1: QrPassword, p2: QrPassword) => p1.join('') === p2.join('');

	const onClick = (e: MouseEvent) => {
		if (state === QrState.LOCKED) {
			return;
		}

		if (state === QrState.UNTOUCHED) {
			state = QrState.TOUCHED;
		}

		const target = e.target as HTMLButtonElement;
		const id = target.id.split('-').pop() as QrPosition;
		const passwordKey = QrPositionToNumber[id];

		currentPassword.push(passwordKey);

		if (currentPassword.length === password.length) {
			if (areSamePasswords(password, currentPassword)) {
				currentPassword = [];
				state = QrState.UNLOCKED;
				onUnlock();
			} else {
				currentPassword = [];
				state = QrState.FAILED_ATTEMPT;
				numberOfFails++;

				if (numberOfFails === MAX_FAILS_AMOUNT) {
					state = QrState.LOCKED;
					onLocked();
					return;
				}

				onError();

				setTimeout(() => (state = QrState.TOUCHED), 300);
			}
		}
	};
</script>

{#each Object.values(QrPosition) as position}
	<QrButton
		{state}
		{position}
		{sizeCss}
		{rounded}
		{animated}
		onClick={password.length ? onClick : undefined}
	/>
{/each}
