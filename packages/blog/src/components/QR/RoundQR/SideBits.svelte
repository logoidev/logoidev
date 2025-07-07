<script lang="ts">
	export let bits: Array<number>;
</script>

<div class="bit-container">
	{#each bits as bit}
		<div class="bit" style={`background-color: ${bit ? 'black' : 'transparent'}`} />
	{/each}
</div>

<style>
	.bit-container {
		display: flex;
		flex-wrap: wrap;
		width: 50px;
		height: 208px;
	}
	.bit {
		width: 6px;
		height: 6px;
		background: black;
		border-radius: 50%;
	}
</style>
