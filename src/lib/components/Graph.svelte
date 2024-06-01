<script>
	import { onMount } from 'svelte';
	import { initializeGraph } from '$lib/d3';
	export let nodes = [];
	export let links = [];
	let svg;

	onMount(() => {
		initializeGraph(svg, nodes, links);
	});
</script>

<svg bind:this={svg} style="width: 100vw; height: 100vh;"></svg>

<style>
	@import url('https://fonts.googleapis.com/css2?family=Oxanium:wght@400;700&display=swap');

	svg {
		display: block;
		background: black;
	}
</style>
