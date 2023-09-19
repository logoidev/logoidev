<script lang="ts">
	import { classArrayToInline } from '../shared/utils';

	export let isGolden = false;
	export let isReverse = true;
</script>

<div
	class={classArrayToInline([
		'wrapper black absolute',
		isGolden ? 'golden' : '',
		isReverse ? 'reverse' : ''
	])}
>
	<div class="container">
		<div class="side left" />
		<div class="side front" />
		<div class="side right" />
		<div class="side back" />

		<div class="shadow" />
	</div>
</div>

<style>
	:root {
		--border: #ccc;
		--border-side: transparent;
		--shadow: #bbb;
		--main: #1abcff;
		--main-dark: #00a2e6;
		--main-darker: #0089c2;
		--main-darkest: #007eb3;
	}

	.black {
		--main: rgba(0, 0, 0, 0.333);
		--main-dark: rgba(0, 0, 0, 0.5);
		--main-darker: rgba(0, 0, 0, 0.666);
		--main-darkest: rgba(0, 0, 0, 0.777);
	}

	.transparent {
		--main: rgba(0, 0, 0, 0.1);
		--main-dark: rgba(0, 0, 0, 0.2);
		--main-darker: rgba(0, 0, 0, 0.33);
		--main-darkest: rgba(0, 0, 0, 0.5);
	}

	.golden {
		--main: #ffd700;
		--main-dark: #e8c500;
		--main-darker: #c7a900;
		--main-darkest: #957e00;
	}

	.wrapper {
		z-index: -1;
	}
	.container {
		width: 400px;
		height: 400px;
		margin: 0 auto;
		position: relative;
		perspective: 300px;
		perspective-origin: 50% 40%;
	}
	.side {
		position: absolute;
		left: 140px;
		top: 150px;
		width: 0;
		height: 0;
		border-left: 60px solid var(--border-side);
		border-right: 60px solid var(--border-side);
		border-bottom: 120px solid var(--border);
		transform-origin: 50% 0%;
		animation: spin 5s infinite linear;
	}
	.reverse .side {
		animation-direction: reverse;
	}
	.back {
		animation-delay: -2.5s;
	}
	.right {
		animation-delay: -1.25s;
	}
	.left {
		animation-delay: -3.75s;
	}
	@keyframes spin {
		0% {
			transform: rotateY(0deg) rotateX(30deg);
			border-bottom-color: var(--main);
		}
		25% {
			transform: rotateY(90deg) rotateX(30deg);
			border-bottom-color: var(--main-dark);
			opacity: 1;
		}
		25.1% {
			opacity: 0;
		}
		50% {
			transform: rotateY(180deg) rotateX(30deg);
			border-bottom-color: var(--main-darker);
		}
		74.9% {
			opacity: 0;
		}
		75% {
			transform: rotateY(270deg) rotateX(30deg);
			border-bottom-color: var(--main-darkest);
			opacity: 1;
		}
		100% {
			transform: rotateY(360deg) rotateX(30deg);
			border-bottom-color: var(--main);
		}
	}

	@keyframes spin-reverse {
		100% {
			transform: rotateY(0deg) rotateX(30deg);
			border-bottom-color: var(--main);
		}
		75% {
			transform: rotateY(90deg) rotateX(30deg);
			border-bottom-color: var(--main-dark);
			opacity: 1;
		}
		74.9% {
			opacity: 0;
		}
		50% {
			transform: rotateY(180deg) rotateX(30deg);
			border-bottom-color: var(--main-darker);
		}
		25.1% {
			opacity: 0;
		}
		25% {
			transform: rotateY(270deg) rotateX(30deg);
			border-bottom-color: var(--main-darkest);
			opacity: 1;
		}
		0% {
			transform: rotateY(360deg) rotateX(30deg);
			border-bottom-color: var(--main);
		}
	}
	.shadow {
		position: absolute;
		top: 300px;
		left: 175px;
		width: 50px;
		height: 50px;
		background-color: var(--shadow);
		box-shadow: 0 0 40px 40px var(--shadow);
		animation: shadow 5s infinite linear;
	}
	.reverse .shadow {
		animation-direction: reverse;
	}
	@keyframes shadow {
		0% {
			transform: rotateX(90deg) rotateZ(0deg);
		}
		100% {
			transform: rotateX(90deg) rotateZ(-360deg);
		}
	}
</style>
