<script lang="ts">
	import { stylesArrayToInline } from '../../shared/utils';

	import { qrIdGenerator } from './QrButtons.utils';
	import { QrPosition, type QrState } from './QrButtons.types';

	export let position: QrPosition;
	export let rounded = false;
	export let animated = false;
	export let sizeCss: string;
	export let state: QrState;
	export let onClick: undefined | ((e: MouseEvent) => void) = undefined;

	const id = qrIdGenerator.getIndex(position);

	const positionClasses: Record<QrPosition, string> = {
		[QrPosition.BOTTOM_LEFT]: `bottom-0 left-0`,
		[QrPosition.TOP_LEFT]: 'top-0 left-0',
		[QrPosition.TOP_RIGHT]: 'top-0 right-0'
	};

	const centerAllFlex = 'flex items-center justify-center';

	$: buttonClass = stylesArrayToInline(
		[
			'absolute',
			`state-${state}`,
			positionClasses[position],
			animated ? 'animated' : '',
			rounded ? 'rounded' : '',
			onClick ? '' : 'pointer-events-none'
		],
		' '
	);
</script>

<button
	{id}
	class={`${centerAllFlex} ${buttonClass}`}
	style={stylesArrayToInline([`width:${sizeCss}`, `height:${sizeCss}`])}
	on:click={onClick}
>
	<div id="border" class={`${centerAllFlex} pointer-events-none`}>
		<div id="inside" class="pointer-events-none" />
	</div>
</button>

<style>
	@keyframes toRound {
		from {
			border-radius: 0;
		}
		to {
			border-radius: 50%;
		}
	}

	@keyframes toSquare {
		from {
			border-radius: 50%;
		}
		to {
			border-radius: 0;
		}
	}

	:root {
		/* TODO: Add tailwind color css variables */
		--red: #dc2626;
		--green: #65a30d;
		--orange: #d97706;
	}

	button {
		margin: -1px;
	}

	button.animated,
	button.animated * {
		animation-duration: 0.5s;
		animation-iteration-count: calc(1);
	}

	button #border {
		width: 75%;
		height: 75%;
		box-shadow: 0 0 0 6px black;
	}

	button #border #inside {
		width: 65%;
		height: 65%;
		background-color: black;
	}

	button.animated,
	button.animated #border,
	button.animated #border #inside {
		animation-name: toSquare;
		border-radius: 0;
	}

	button.rounded,
	button.rounded #border,
	button.rounded #border #inside {
		animation-name: toRound;
		border-radius: 50%;
	}

	button.state-failed {
		background-color: var(--red);
	}

	button.state-unlocked {
		background-color: var(--green);
	}

	button.state-locked {
		background-color: var(--orange);
		pointer-events: none;
	}

	button.state-failed-attempt #border #inside {
		background-color: var(--red);
	}
</style>
