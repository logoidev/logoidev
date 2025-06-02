<script lang="ts">
	export let text: string;
	export let class_name = '';
</script>

<button
	class="text-xs text-blue-600 h-8 w-full relative hover:text-blue-700 font-mono bg-gray-100 px-2 py-1 rounded border border-gray-300 min-w-[200px] text-center {class_name}"
	on:click={function () {
		// Important to be a function declaration, not an arrow function, so that `this` is bound to the button element
		navigator.clipboard.writeText(text);

		// @ts-ignore
		const textElement = this.children[0];
		// @ts-ignore
		const copiedIndicatorElement = this.children[1];

		textElement.classList.add('invisible');
		copiedIndicatorElement.classList.remove('invisible');

		setTimeout(() => {
			textElement.textContent = text;
			textElement.classList.remove('invisible');
			copiedIndicatorElement.classList.add('invisible');
		}, 2000);
	}}
>
	<div class="w-full h-full flex items-center justify-center">{text}</div>
	<div class="invisible absolute top-0 left-0 w-full h-full flex items-center justify-center">
		Copied
	</div>
</button>
