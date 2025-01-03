<script lang="ts">
	import { clsx } from 'clsx';
	import Pyramid from './Pyramid.svelte';
	import { getSvgParams } from './SVG/SVG.utils';
	import { trackAnalyticsEvent } from './AnalyticsScripts.svelte';

	const SERVICES = ['Web', 'Design', 'Development', 'Spatial Computing', 'Software Engineering'];

	let isShown: null | boolean = null;
	const toggleShown = () => {
		isShown = !isShown;
		trackAnalyticsEvent('pyramid:toggle', { shown: isShown });
	};

	let isGolden = false;
	const onCapClick = (e: MouseEvent) => {
		if (isShown) {
			e.stopPropagation();
			isGolden = !isGolden;
		}
	};

	const svgParams = getSvgParams({ width: 250, height: 154 });
</script>

<div
	role="presentation"
	class={clsx('button relative mt-12 mb-6 flex items-center justify-center', [
		isShown ? 'shown' : 'h-8',
		isGolden ? 'golden' : ''
	])}
	on:click={toggleShown}
	on:keydown={toggleShown}
>
	<button class="cap absolute h-full w-8" on:click={onCapClick}>
		<svg {...svgParams}>
			<path d="M222.5 0L444.635 273H0.364487L222.5 0Z" />
		</svg>
	</button>

	<div class="pyramid w-32">
		<svg {...svgParams}>
			{#if isShown !== null}
				<path
					fill={isShown ? '#fff' : 'none'}
					opacity={0.666}
					stroke="#000"
					stroke-width="2"
					d="M 250.206 8.555 L 493.187 307.932 L 7.225 307.932 L 250.206 8.555 Z"
				/>
			{/if}
		</svg>
	</div>

	{#if isShown !== null}
		<ul class={clsx('absolute mt-3 text-3xl text-center', { shown: isShown })}>
			{#each SERVICES as service}
				<li class="text-xl my-px">{service}</li>
			{/each}
		</ul>
	{/if}

	<Pyramid {isGolden} isReverse={!isGolden} />
</div>

<style>
	@keyframes fade-in {
		0% {
			opacity: 0;
		}
		100% {
			opacity: 1;
		}
	}

	@keyframes fade-out {
		0% {
			opacity: 1;
		}
		100% {
			opacity: 0;
		}
	}

	@keyframes dash-in {
		from {
			stroke-dashoffset: 1258;
		}
		to {
			stroke-dashoffset: 0;
		}
	}

	@keyframes dash-out {
		from {
			stroke-dashoffset: 0;
		}
		to {
			stroke-dashoffset: 1258;
		}
	}

	@keyframes color-change {
		0% {
			--cap-color: #000;
		}
		100% {
			--cap-color: var(--gold);
		}
	}

	:root {
		--black: #000;
		--gold: #ffd700;
		--cap-color: var(--black);
	}
	.button {
		height: 208px;
	}

	.button:hover {
		cursor: pointer;
	}

	.pyramid {
		width: 21rem;
		margin: -0.5rem;
	}

	.cap {
		width: 100px;
		height: 200px;
	}

	ul {
		top: 44px;
		width: 324px;
	}

	ul li {
		font-family: 'Trajan Pro', serif;
		transition: 0.2s all ease-in-out;
		opacity: 0;
		pointer-events: none;
	}

	.pyramid svg {
		animation: dash-out 0.666s linear;
		stroke-dasharray: 1258;
		stroke-dashoffset: 1258;
	}

	.shown .pyramid svg {
		animation: dash-in 0.666s linear;
		stroke-dasharray: 1258;
		stroke-dashoffset: 0;
	}

	.cap {
		height: 36px;
		top: calc(-2.5rem + 10px);
		transition: transform 0.333s ease-in;
		transform: scaleX(-1) scaleY(-1) translate(4px, 0);
	}
	.shown .cap {
		transform: scaleX(1) translate(3px, calc(2.5rem - 2px));
	}
	.golden .cap svg path {
		--cap-color: var(--gold);
		fill: var(--cap-color);
	}

	.cap svg path {
		fill: var(--cap-color);
	}
	.shown .cap svg path {
		--cap-color: var(--gold);
	}

	.shown ul li {
		animation: fade-in 0.5s;
		animation-fill-mode: forwards;
		pointer-events: all;
		opacity: 1;
	}

	:not(.shown) ul li {
		animation: fade-out 0.5s;
	}
</style>
