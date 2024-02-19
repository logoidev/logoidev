<script lang="ts">
	import { getByteStrings } from 'src/utils/binary';

	import { normaliseQrLocalhostUrl } from '../QrSvg/QrSvg.utils';
	import QR from '../QR.svelte';
	import SideBits from './SideBits.svelte';
	import clsx from 'clsx';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	export let route = window.location.href;
	const url = normaliseQrLocalhostUrl(route);

	export let withBorder = true;

	// TODO: Make not random but be able to store information (e.g. curve correction)
	const bits = getByteStrings(40, 0.5).join('').split('').map(Number);
</script>

<div class="max-h-[330px]">
	<div
		class="outer-circle"
		style={clsx({
			'box-shadow: 0 0 0 4px black': withBorder
		})}
	>
		<div class="qr-center">
			<QR class="m-1 absolute z-30" {url} rounded on:click={() => dispatch('click')} />
		</div>

		<div class="bit-group">
			<SideBits {bits} />

			<SideBits {bits} />
		</div>

		<div class="bit-group rotated">
			<SideBits {bits} />

			<SideBits {bits} />
		</div>
	</div>
</div>

<style>
	.outer-circle {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 20rem;
		width: 20rem;
		border-radius: 50%;
		position: relative;
		/* TODO: Remove overflow, use curve calculation to render or not */
		overflow: hidden;
	}

	.qr-center {
		width: 224px;
	}

	.bit-group {
		position: absolute;
		width: 100%;
		display: flex;
		justify-content: space-between;
	}

	.rotated {
		transform: rotate(90deg);
	}
</style>
