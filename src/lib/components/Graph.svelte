<script>
	import { onMount } from 'svelte';
	import { initializeGraph } from '$lib/D3.js';


	export let nodes = [];
	export let links = [];
	let svg;

	onMount(() => {
		initializeGraph(svg, nodes, links);
	});
</script>

<svg bind:this={svg} style="width: 100vw; height: 100vh; border: 1px solid #ccc;"></svg>
