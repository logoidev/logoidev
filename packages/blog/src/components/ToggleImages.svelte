<script lang="ts">
	import { clsx } from 'clsx';

	export let hideImages = false;
	export let position: 'relative' | 'fixed' = 'fixed';

	const toggleImages = () => (hideImages = !hideImages);
</script>

<button
	class={clsx('scale-125 opacity-50 hover:opacity-95', {
		'relative top-1.5': position === 'relative',
		'fixed bottom-2 right-14': position === 'fixed'
	})}
	on:click={toggleImages}
>
	<span class="material-symbols-outlined">photo_library</span>
	<!-- Emulating a minus sign -->

	<div class="relative">
		<div class="absolute text-black text-sm bg-white leading-3 right-[-3px] p-0.5 -top-9 w-3">
			{hideImages ? '+' : '-'}
		</div>
	</div>
</button>
