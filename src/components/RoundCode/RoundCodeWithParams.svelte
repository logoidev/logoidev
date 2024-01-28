<script lang="ts">
	// import { dev } from '$app/environment';

	import RoundCode from './RoundCode.svelte';

	export let id: string;
	export let counter: number = 0;

	let bytes = 36;
	let size = 320;
	let angle = 360 / bytes;
	let translateX = 0;
	let translateY = 160;
	let originX = 160;
	let originY = 0;

	let areParamsAvailable = false;
	let areParamsShown = false;
</script>

<div class="text-center mt-4 max-h-[330px]">
	<RoundCode
		coinId={id}
		{counter}
		{bytes}
		{size}
		{angle}
		{translateX}
		{translateY}
		{originX}
		{originY}
	/>

	{#if areParamsShown}
		<div>
			<div>
				<input
					type="range"
					id="bytes"
					name="bytes"
					min="1"
					max="40"
					step={1}
					value={bytes}
					on:change={(e) => {
						bytes = +e.currentTarget.value;
						angle = Math.floor(360 / bytes);
					}}
				/>
				<label for="angle">Bytes: {bytes}</label>
			</div>
			<div>
				<input
					type="range"
					id="angle"
					name="angle"
					min="0"
					max="30"
					step={0.5}
					value={angle}
					on:change={(e) => (angle = +e.currentTarget.value)}
				/>
				<label for="angle">Angle: {angle}</label>
			</div>
			<div>
				<input
					type="range"
					id="translateX"
					name="translateX"
					min="0"
					max="320"
					step={10}
					value={translateX}
					on:change={(e) => (translateX = +e.currentTarget.value)}
				/>
				<label for="translateX">Translate X: {translateX}</label>
			</div>

			<div>
				<input
					type="range"
					id="translateY"
					name="translateY"
					min="0"
					max="320"
					step={10}
					value={translateY}
					on:change={(e) => (translateY = +e.currentTarget.value)}
				/>
				<label for="translateY">Translate Y: {translateY}</label>
			</div>

			<div>
				<input
					type="range"
					id="originX"
					name="originX"
					min="0"
					max="320"
					step={10}
					value={originX}
					on:change={(e) => (originX = +e.currentTarget.value)}
				/>
				<label for="originX">Origin X: {originX}</label>
			</div>

			<div>
				<input
					type="range"
					id="originY"
					name="originY"
					min="0"
					max="320"
					step={10}
					value={originY}
					on:change={(e) => (originY = +e.currentTarget.value)}
				/>
				<label for="originY">Origin Y: {originY}</label>
			</div>
		</div>
	{/if}
	<br />
	{#if areParamsAvailable}
		<button on:click={() => (areParamsShown = !areParamsShown)}>Params</button>
	{/if}
	<br />
</div>
